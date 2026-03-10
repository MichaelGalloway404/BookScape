import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BookList from "../components/BookList";
import TextComponent from "../components/TextComponent";
import EditablePopup from "../components/EditablePopup"
import styles from "./UsersPage.module.css"

function UsersPage() {
    const [user, setUser] = useState(null);
    const [profilePublic, setProfilePrivate] = useState(false);
    const [books, setBooks] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editing, setEditing] = useState(false);
    const [settings, setSettings] = useState({});
    const [menuOpen, setMenuOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // main page settings
    const [pageBckColor, setPageBckColor] = useState("#c4ccd5");
    const [pageBckColor2, setPageBckColor2] = useState("#c4ccd5");
    const [gradientAngle, setGradientAngle] = useState(135);

    // div control settings
    const [mainDivGradientAngle, setMainDivGradientAngle] = useState(135);
    const [mainDivBGColor, setMainDivBGColor] = useState("white");
    const [mainDivBGColor2, setMainDivBGColor2] = useState("white");
    const [mainDivPadding, setMainDivPadding] = useState(2);
    const [mainDivBorderSize, setMainDivBorderSize] = useState(5);
    const [mainDivBorderStyle, setMainDivBorderStyle] = useState("solid");
    const [mainDivBorderColor, setMainDivBorderColor] = useState("black");
    const [mainDivBorderRadius, setMainDivBorderRadius] = useState(5);
    const [mainDivMarginLeft, setMainDivMarginLeft] = useState(1);
    const [mainDivMarginRight, setMainDivMarginRight] = useState(1);
    const [mainDivMarginTop, setMainDivMarginTop] = useState(1);
    const [mainDivMarginBottom, setMainDivMarginBottom] = useState(1);

    const popupRef = useRef(null);

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // ensure userQuotes exists in settings
    useEffect(() => {
        setSettings(prev => ({
            ...prev,
            mainPage: {
                ...prev.mainPage,
                userQuotes: prev?.mainPage?.userQuotes || []
            }
        }));
    }, []);

    // add any changes to settings the user makes
    useEffect(() => {
        setSettings(prev => ({
            ...prev,
            mainPage: {
                ...prev.mainPage,
                // main page
                pageBckColor,
                pageBckColor2,
                gradientAngle,
                // div control
                mainDivGradientAngle,
                mainDivBGColor,
                mainDivBGColor2,
                mainDivPadding,
                mainDivBorderSize,
                mainDivBorderStyle,
                mainDivBorderColor,
                mainDivBorderRadius,
                mainDivMarginLeft,
                mainDivMarginRight,
                mainDivMarginTop,
                mainDivMarginBottom,
            },
        }));
    }, [
        // main page
        pageBckColor,
        pageBckColor2,
        gradientAngle,
        // div control
        mainDivGradientAngle,
        mainDivBGColor,
        mainDivBGColor2,
        mainDivPadding,
        mainDivBorderSize,
        mainDivBorderStyle,
        mainDivBorderColor,
        mainDivBorderRadius,
        mainDivMarginLeft,
        mainDivMarginRight,
        mainDivMarginTop,
        mainDivMarginBottom,
    ]);

    // Check for DB saved settings
    useEffect(() => {
        if (settings?.mainPage) {
            // main page
            if (settings.mainPage.pageBckColor) setPageBckColor(settings.mainPage.pageBckColor);
            if (settings.mainPage.pageBckColor2) setPageBckColor2(settings.mainPage.pageBckColor2);
            if (settings.mainPage.gradientAngle) setGradientAngle(settings.mainPage.gradientAngle);
            // div control
            if (settings.mainPage.mainDivGradientAngle) setMainDivGradientAngle(settings.mainPage.mainDivGradientAngle);
            if (settings.mainPage.mainDivBGColor) setMainDivBGColor(settings.mainPage.mainDivBGColor);
            if (settings.mainPage.mainDivBGColor2) setMainDivBGColor2(settings.mainPage.mainDivBGColor2);
            if (settings.mainPage.mainDivPadding) setMainDivPadding(settings.mainPage.mainDivPadding);
            if (settings.mainPage.mainDivBorderSize) setMainDivBorderSize(settings.mainPage.mainDivBorderSize);
            if (settings.mainPage.mainDivBorderStyle) setMainDivBorderStyle(settings.mainPage.mainDivBorderStyle);
            if (settings.mainPage.mainDivBorderColor) setMainDivBorderColor(settings.mainPage.mainDivBorderColor);
            if (settings.mainPage.mainDivBorderRadius) setMainDivBorderRadius(settings.mainPage.mainDivBorderRadius);
            if (settings.mainPage.mainDivMarginLeft) setMainDivMarginLeft(settings.mainPage.mainDivMarginLeft);
            if (settings.mainPage.mainDivMarginRight) setMainDivMarginRight(settings.mainPage.mainDivMarginRight);
            if (settings.mainPage.mainDivMarginTop) setMainDivMarginTop(settings.mainPage.mainDivMarginTop);
            if (settings.mainPage.mainDivMarginBottom) setMainDivMarginBottom(settings.mainPage.mainDivMarginBottom);
        }
    }, [settings]);

    // apply background gradient
    useEffect(() => {
        const originalBackground = document.body.style.background;

        document.body.style.background =
            `linear-gradient(${gradientAngle}deg, ${pageBckColor}, ${pageBckColor2})`;

        return () => {
            document.body.style.background = originalBackground;
        };
    }, [pageBckColor, pageBckColor2, gradientAngle]);

    // Close popup if click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setEditing(false);
            }
        }

        if (editing) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editing]);

    // load user
    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await fetch("/api/currentUser", {
                    method: "GET",
                    credentials: "include",
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Not authenticated");
                }

                setUser(data);

                const booksRes = await fetch("/api/userBooks", {
                    method: "GET",
                    credentials: "include",
                });

                const booksData = await booksRes.json();

                if (booksRes.ok) {
                    setBooks(booksData);
                }

                let orderedBooks = booksData;

                if (Array.isArray(data.book_order_json) && data.book_order_json.length > 0) {
                    const orderMap = new Map(
                        data.book_order_json.map((isbn, index) => [isbn, index])
                    );

                    orderedBooks = booksData.slice().sort((a, b) => {
                        const aIndex = orderMap.get(a.isbn);
                        const bIndex = orderMap.get(b.isbn);

                        if (aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex;
                        if (aIndex !== undefined) return -1;
                        if (bIndex !== undefined) return 1;
                        return 0;
                    });
                }

                const userSettingsRes = await fetch("/api/userSettings", {
                    method: "GET",
                    credentials: "include",
                });

                const userSettingsData = await userSettingsRes.json();

                if (userSettingsRes.ok) {
                    setSettings(userSettingsData || {});
                }

                setProfilePrivate(data.private);
                setBooks(orderedBooks);
                setLoading(false);

            } catch (err) {
                console.error(err);
                navigate("/login");
            }
        };

        loadUser();
    }, [navigate]);

    // DELETE BOOK
    async function deleteBook(book) {
        try {
            const res = await fetch("/api/userBooks", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    isbn: book.isbn,
                    cover_id: book.cover_id,
                }),
            });

            if (!res.ok) throw new Error("Failed to delete book");

            setBooks(prev =>
                prev.filter(
                    b => !(b.isbn === book.isbn && b.cover_id === book.cover_id)
                )
            );
        } catch (err) {
            console.error(err);
        }
    }

    // ADD NEW USER QUOTE
    function addUserQuote() {

        const nextNumber = (settings.mainPage?.userQuotes?.length || 0) + 1;

        const newKey = `UserQuote_${nextNumber}`;

        setSettings(prev => ({
            ...prev,
            mainPage: {
                ...prev.mainPage,
                userQuotes: [...(prev.mainPage?.userQuotes || []), newKey]
            }
        }));
    }

    // SAVE SETTINGS
    async function saveSettings(bookOrder) {
        setSaving(true);
        try {
            await axios.post(
                "/api/currentUser",
                { privateStatus: profilePublic },
                { withCredentials: true }
            );
        } catch (err) {
            console.error(err);
            // alert("Failed to Set");
        }

        const isbns = bookOrder.map(book => String(book.isbn));

        try {
            await axios.post(
                "/api/currentUser",
                { bookOrderPref: isbns },
                { withCredentials: true }
            );
        } catch (err) {
            console.error(err);
            // alert("Failed to book order!");
        }

        try {
            await axios.post(
                "/api/userSettings",
                settings,
                { withCredentials: true }
            );

            // alert("Profile Settings Saved!");
            setSaving(false);
        } catch (err) {
            console.error(err);
            // alert("Failed to Save!");
        }
    }

    // DELETE A USER QUOTE/TEXT
    function deleteUserQuote(quoteKey) {
        setSettings(prev => {
            const newSettings = { ...prev };

            newSettings.mainPage.userQuotes =
                newSettings.mainPage.userQuotes.filter(q => q !== quoteKey);

            delete newSettings[quoteKey];

            return newSettings;
        });
    }

    if (loading || !settings) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <p>Loading page...</p>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    return (
        <div style={{
            background: `linear-gradient(${mainDivGradientAngle}deg, ${mainDivBGColor},${mainDivBGColor2})`,
            padding: mainDivPadding + "px",
            border: `${mainDivBorderSize}px ${mainDivBorderStyle} ${mainDivBorderColor}`,
            borderRadius: mainDivBorderRadius + "px",
            marginLeft: mainDivMarginLeft + "px",
            marginRight: mainDivMarginRight + "px",
            marginTop: mainDivMarginTop + "px",
            marginBottom: mainDivMarginBottom + "px",
        }}
        >
            {editing && editMode && (
                <EditablePopup
                    popupRef={popupRef}
                    controls={{
                        // body of page settings
                        "Page Background Color 1": [pageBckColor, setPageBckColor],
                        "Page Background Color 2": [pageBckColor2, setPageBckColor2],
                        "Gradient Angle": [Number(gradientAngle), setGradientAngle],
                        "Profile is Private": [profilePublic, setProfilePrivate],
                        "break1": "",
                        // main div of page settings
                        "Center of page Background Color 1": [mainDivBGColor, setMainDivBGColor],
                        "Center of page Background Color 2": [mainDivBGColor2, setMainDivBGColor2],
                        "Center Page Gradient Angle": [Number(mainDivGradientAngle), setMainDivGradientAngle],
                        "Center Page Padding": [mainDivPadding, setMainDivPadding],
                        "break2": "",
                        "Center Page Border Size": [mainDivBorderSize, setMainDivBorderSize],
                        "Center Page Border Style": [mainDivBorderStyle, setMainDivBorderStyle],
                        "Center Page Border Color": [mainDivBorderColor, setMainDivBorderColor],
                        "Center Page Border Radius": [mainDivBorderRadius, setMainDivBorderRadius],
                        "break3": "",
                        "Center Page Margin Left": [mainDivMarginLeft, setMainDivMarginLeft],
                        "Center Page Margin Right": [mainDivMarginRight, setMainDivMarginRight],
                        "Center Page Margin Top": [mainDivMarginTop, setMainDivMarginTop],
                        "Center Page Margin Bottom": [mainDivMarginBottom, setMainDivMarginBottom],
                    }}
                />
            )}

            <TextComponent
                ComponentName={"UserPageTitle"}
                defaultText={"Make a page Title " + user.username}
                textMutable={true}
                editMode={editMode}
                settings={settings}
                setSettings={setSettings}
            />

            <TextComponent
                ComponentName={"UserBio"}
                defaultText={"Type your " + user.username + " Bio here..."}
                textMutable={true}
                editMode={editMode}
                settings={settings}
                setSettings={setSettings}
            />

            <BookList
                books={books}
                editMode={editMode}
                settings={settings}
                deleteBook={deleteBook}
                setBooks={setBooks}
                setSettings={setSettings}
            />

            {/* USER QUOTES */}
            {settings?.mainPage?.userQuotes?.map((quoteKey) => (
                <div key={quoteKey}>
                    <TextComponent
                        ComponentName={quoteKey}
                        defaultText={"Type something"}
                        textMutable={true}
                        editMode={editMode}
                        settings={settings}
                        setSettings={setSettings}
                    />

                    {editMode && (
                        <button
                            onClick={() => deleteUserQuote(quoteKey)}
                            style={{ backgroundColor: "#ff2727b5", color: "black", borderRadius:"5px", position: "absolute"}}
                        >
                            Delete Section
                        </button>
                    )}
                </div>
            ))}

            {/* Hamburger button for user options */}
            <button
                className={styles.hamburger}
                onClick={() => setMenuOpen(prev => !prev)}
            >
                ☰
            </button>

            {menuOpen && (
                <div className={styles.dropdown}>

                    <button
                        className={styles.buttonClass}
                        onClick={() => navigate("/search")}
                    >
                        Search for a book
                    </button>

                    <button
                        className={styles.buttonClass}
                        onClick={() => navigate("/")}
                    >
                        Return Home
                    </button>

                    <button
                        onClick={() => setEditMode(prev => !prev)}
                        className={styles.buttonClass}
                        style={{backgroundColor: editMode ? "#da5858" : " #63cd8c"}}
                    >
                        {editMode ? "Done" : "Edit"}
                    </button>
                    {editMode && (
                        <button
                            onClick={() => saveSettings(books)}
                            className={styles.buttonClass}
                        >
                            Save Settings { saving && (<div className={styles.spinner}></div>)}
                        </button>
                    )}

                    {editMode && (
                        <button
                            onClick={(e) => {
                                setEditing(true);
                            }}
                            className={styles.buttonClass}
                        >
                            Click for page settings
                        </button>
                    )}

                    {editMode && (
                        <button
                            onClick={addUserQuote}
                            className={styles.buttonClass}
                        >
                            Add Text Section
                        </button>
                    )}

                </div>
            )}
        </div>
    );
}

export default UsersPage;