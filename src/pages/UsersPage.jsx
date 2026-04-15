import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BookList from "../components/BookList";
import TextComponent from "../components/TextComponent";
import EditablePopup from "../components/EditablePopup"
import styles from "./UsersPage.module.css"
import SiteInfoFooter from '../components/SiteInfoFooter';

function UsersPage() {
    // const [user, setUser] = useState(null);
    const [profilePublic, setProfilePrivate] = useState(false);
    // const [books, setBooks] = useState([]);
    // const [editMode, setEditMode] = useState(false);
    // const [editing, setEditing] = useState(false);
    // const [settings, setSettings] = useState({});
    // const [menuOpen, setMenuOpen] = useState(false);
    // const [saving, setSaving] = useState(false);

    // // main page settings
    // const [pageBckColor, setPageBckColor] = useState("#c4ccd5");
    // const [pageBckColor2, setPageBckColor2] = useState("#c4ccd5");
    // const [gradientAngle, setGradientAngle] = useState(0);

    // // div control settings
    // const [mainDivGradientAngle, setMainDivGradientAngle] = useState(0);
    // const [mainDivBGColor, setMainDivBGColor] = useState("white");
    // const [mainDivBGColor2, setMainDivBGColor2] = useState("white");
    // const [mainDivPadding, setMainDivPadding] = useState(0);
    // const [mainDivBorderSize, setMainDivBorderSize] = useState(0);
    // const [mainDivBorderStyle, setMainDivBorderStyle] = useState("solid");
    // const [mainDivBorderColor, setMainDivBorderColor] = useState("black");
    // const [mainDivBorderRadius, setMainDivBorderRadius] = useState(0);
    // const [mainDivMarginLeft, setMainDivMarginLeft] = useState(0);
    // const [mainDivMarginRight, setMainDivMarginRight] = useState(0);
    // const [mainDivMarginTop, setMainDivMarginTop] = useState(0);
    // const [mainDivMarginBottom, setMainDivMarginBottom] = useState(0);
    // const [mainDivBckGrndOn, setMainDivBckGrndOn] = useState(true);

    // // Book List Bounding div
    // const [bookListDivGradientAngle, setBookListDivGradientAngle] = useState(0);
    // const [bookListDivBGColor, setBookListDivBGColor] = useState("white");
    // const [bookListDivBGColor2, setBookListDivBGColor2] = useState("white");
    // const [bookListDivBorderSize, setBookListDivBorderSize] = useState(0);
    // const [bookListDivBorderStyle, setBookListDivBorderStyle] = useState("solid");
    // const [bookListDivBorderColor, setBookListDivBorderColor] = useState("black");
    // const [bookListDivBorderRadius, setBookListDivBorderRadius] = useState(0);
    // const [bookListDivMarginLeft, setBookListDivMarginLeft] = useState(0);
    // const [bookListDivMarginRight, setBookListDivMarginRight] = useState(0);
    // const [bookListDivMarginTop, setBookListDivMarginTop] = useState(0);
    // const [bookListDivMarginBottom, setBookListDivMarginBottom] = useState(0);
    // const [bookListDivPaddingLeft, setBookListDivPaddingLeft] = useState(0);
    // const [bookListDivPaddingRight, setBookListDivPaddingRight] = useState(0);
    // const [bookListDivPaddingTop, setBookListDivPaddingTop] = useState(0);
    // const [bookListDivPaddingBottom, setBookListDivPaddingBottom] = useState(0);
    // const [bookListDivBckGrndOn, setBookListDivBckGrndOn] = useState(true);


    // const popupRef = useRef(null);

    // const [loading, setLoading] = useState(true);

    // const navigate = useNavigate();

    // // add any changes to settings the user makes
    // useEffect(() => {
    //     setSettings(prev => ({
    //         ...prev,
    //         mainPage: {
    //             ...prev.mainPage,
    //             // ensure userQuotes exists in settings
    //             // prevents accidentally deleting userQuotes every time the effect runs.
    //             userQuotes: prev?.mainPage?.userQuotes || [],
    //             // main page
    //             pageBckColor,
    //             pageBckColor2,
    //             gradientAngle,
    //             // main div control
    //             mainDivGradientAngle,
    //             mainDivBGColor,
    //             mainDivBGColor2,
    //             mainDivPadding,
    //             mainDivBorderSize,
    //             mainDivBorderStyle,
    //             mainDivBorderColor,
    //             mainDivBorderRadius,
    //             mainDivMarginLeft,
    //             mainDivMarginRight,
    //             mainDivMarginTop,
    //             mainDivMarginBottom,
    //             mainDivBckGrndOn,
    //             // Book List Bounding div
    //             bookListDivGradientAngle,
    //             bookListDivBGColor,
    //             bookListDivBGColor2,
    //             bookListDivBorderSize,
    //             bookListDivBorderStyle,
    //             bookListDivBorderColor,
    //             bookListDivBorderRadius,
    //             bookListDivMarginLeft,
    //             bookListDivMarginRight,
    //             bookListDivMarginTop,
    //             bookListDivMarginBottom,
    //             bookListDivPaddingLeft,
    //             bookListDivPaddingRight,
    //             bookListDivPaddingTop,
    //             bookListDivPaddingBottom,
    //             bookListDivBckGrndOn,

    //         },
    //     }));
    // }, [
    //     // main page
    //     pageBckColor,
    //     pageBckColor2,
    //     gradientAngle,
    //     // main div control
    //     mainDivGradientAngle,
    //     mainDivBGColor,
    //     mainDivBGColor2,
    //     mainDivPadding,
    //     mainDivBorderSize,
    //     mainDivBorderStyle,
    //     mainDivBorderColor,
    //     mainDivBorderRadius,
    //     mainDivMarginLeft,
    //     mainDivMarginRight,
    //     mainDivMarginTop,
    //     mainDivMarginBottom,
    //     mainDivBckGrndOn,
    //     // Book List Bounding div
    //     bookListDivGradientAngle,
    //     bookListDivBGColor,
    //     bookListDivBGColor2,
    //     bookListDivBorderSize,
    //     bookListDivBorderStyle,
    //     bookListDivBorderColor,
    //     bookListDivBorderRadius,
    //     bookListDivMarginLeft,
    //     bookListDivMarginRight,
    //     bookListDivMarginTop,
    //     bookListDivMarginBottom,
    //     bookListDivPaddingLeft,
    //     bookListDivPaddingRight,
    //     bookListDivPaddingTop,
    //     bookListDivPaddingBottom,
    //     bookListDivBckGrndOn,
    // ]);

    // // Check for DB saved settings
    // useEffect(() => {
    //     if (settings?.mainPage) {
    //         // main page
    //         if (settings.mainPage.pageBckColor) setPageBckColor(settings.mainPage.pageBckColor);
    //         if (settings.mainPage.pageBckColor2) setPageBckColor2(settings.mainPage.pageBckColor2);
    //         if (settings.mainPage.gradientAngle) setGradientAngle(settings.mainPage.gradientAngle);
    //         // main div control
    //         if (settings.mainPage.mainDivGradientAngle) setMainDivGradientAngle(settings.mainPage.mainDivGradientAngle);
    //         if (settings.mainPage.mainDivBGColor) setMainDivBGColor(settings.mainPage.mainDivBGColor);
    //         if (settings.mainPage.mainDivBGColor2) setMainDivBGColor2(settings.mainPage.mainDivBGColor2);
    //         if (settings.mainPage.mainDivPadding) setMainDivPadding(settings.mainPage.mainDivPadding);
    //         if (settings.mainPage.mainDivBorderSize) setMainDivBorderSize(settings.mainPage.mainDivBorderSize);
    //         if (settings.mainPage.mainDivBorderStyle) setMainDivBorderStyle(settings.mainPage.mainDivBorderStyle);
    //         if (settings.mainPage.mainDivBorderColor) setMainDivBorderColor(settings.mainPage.mainDivBorderColor);
    //         if (settings.mainPage.mainDivBorderRadius) setMainDivBorderRadius(settings.mainPage.mainDivBorderRadius);
    //         if (settings.mainPage.mainDivMarginLeft) setMainDivMarginLeft(settings.mainPage.mainDivMarginLeft);
    //         if (settings.mainPage.mainDivMarginRight) setMainDivMarginRight(settings.mainPage.mainDivMarginRight);
    //         if (settings.mainPage.mainDivMarginTop) setMainDivMarginTop(settings.mainPage.mainDivMarginTop);
    //         if (settings.mainPage.mainDivMarginBottom) setMainDivMarginBottom(settings.mainPage.mainDivMarginBottom);
    //         if (settings.mainPage.mainDivBckGrndOn !== undefined) setMainDivBckGrndOn(settings.mainPage.mainDivBckGrndOn);
    //         // Book List Bounding div
    //         if (settings.mainPage.bookListDivGradientAngle) setBookListDivGradientAngle(settings.mainPage.bookListDivGradientAngle);
    //         if (settings.mainPage.bookListDivBGColor) setBookListDivBGColor(settings.mainPage.bookListDivBGColor);
    //         if (settings.mainPage.bookListDivBGColor2) setBookListDivBGColor2(settings.mainPage.bookListDivBGColor2);
    //         if (settings.mainPage.bookListDivBorderSize) setBookListDivBorderSize(settings.mainPage.bookListDivBorderSize);
    //         if (settings.mainPage.bookListDivBorderStyle) setBookListDivBorderStyle(settings.mainPage.bookListDivBorderStyle);
    //         if (settings.mainPage.bookListDivBorderColor) setBookListDivBorderColor(settings.mainPage.bookListDivBorderColor);
    //         if (settings.mainPage.bookListDivBorderRadius) setBookListDivBorderRadius(settings.mainPage.bookListDivBorderRadius);
    //         if (settings.mainPage.bookListDivMarginLeft) setBookListDivMarginLeft(settings.mainPage.bookListDivMarginLeft);
    //         if (settings.mainPage.bookListDivMarginRight) setBookListDivMarginRight(settings.mainPage.bookListDivMarginRight);
    //         if (settings.mainPage.bookListDivMarginTop) setBookListDivMarginTop(settings.mainPage.bookListDivMarginTop);
    //         if (settings.mainPage.bookListDivMarginBottom) setBookListDivMarginBottom(settings.mainPage.bookListDivMarginBottom);
    //         if (settings.mainPage.bookListDivPaddingLeft) setBookListDivPaddingLeft(settings.mainPage.bookListDivPaddingLeft);
    //         if (settings.mainPage.bookListDivPaddingRight) setBookListDivPaddingRight(settings.mainPage.bookListDivPaddingRight);
    //         if (settings.mainPage.bookListDivPaddingTop) setBookListDivPaddingTop(settings.mainPage.bookListDivPaddingTop);
    //         if (settings.mainPage.bookListDivPaddingBottom) setBookListDivPaddingBottom(settings.mainPage.bookListDivPaddingBottom);
    //         if (settings.mainPage.bookListDivBckGrndOn !== undefined) setBookListDivBckGrndOn(settings.mainPage.bookListDivBckGrndOn);
    //     }
    // }, [settings]);

    const [user, setUser] = useState(null);
    const [books, setBooks] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editing, setEditing] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const popupRef = useRef(null);
    const navigate = useNavigate();

    const [settings, setSettings] = useState({
        mainPage: {
            pageBckColor: "#c4ccd5",
            pageBckColor2: "#c4ccd5",
            gradientAngle: 0,

            mainDivGradientAngle: 0,
            mainDivBGColor: "white",
            mainDivBGColor2: "white",
            mainDivPadding: 0,
            mainDivBorderSize: 0,
            mainDivBorderStyle: "solid",
            mainDivBorderColor: "black",
            mainDivBorderRadius: 0,
            mainDivMarginLeft: 0,
            mainDivMarginRight: 0,
            mainDivMarginTop: 0,
            mainDivMarginBottom: 0,
            mainDivBckGrndOn: true,

            bookListDivGradientAngle: 0,
            bookListDivBGColor: "white",
            bookListDivBGColor2: "white",
            bookListDivBorderSize: 0,
            bookListDivBorderStyle: "solid",
            bookListDivBorderColor: "black",
            bookListDivBorderRadius: 0,
            bookListDivMarginLeft: 0,
            bookListDivMarginRight: 0,
            bookListDivMarginTop: 0,
            bookListDivMarginBottom: 0,
            bookListDivPaddingLeft: 0,
            bookListDivPaddingRight: 0,
            bookListDivPaddingTop: 0,
            bookListDivPaddingBottom: 0,
            bookListDivBckGrndOn: true,

            userQuotes: [],
        },
    });

    // Helper to update settings
    const updateMainPage = (key, value) => {
        setSettings(prev => ({
            ...prev,
            mainPage: {
                ...prev.mainPage,
                [key]: value,
            },
        }));
    };

    const s = settings.mainPage;

    // apply background gradient
    useEffect(() => {
        const originalBackground = document.body.style.background;

        document.body.style.background =
            `linear-gradient(${s.gradientAngle}deg, ${s.pageBckColor}, ${s.pageBckColor2})`;

        return () => {
            document.body.style.background = originalBackground;
        };
    }, [s.gradientAngle, s.pageBckColor, s.pageBckColor2]);

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
            background: (s.mainDivBckGrndOn ? `linear-gradient(${s.mainDivGradientAngle}deg, ${s.mainDivBGColor},${s.mainDivBGColor2})` : "none"),
            padding: s.mainDivPadding + "px",
            border: `${s.mainDivBorderSize}px ${s.mainDivBorderStyle} ${s.mainDivBorderColor}`,
            borderRadius: s.mainDivBorderRadius + "px",
            marginLeft: s.mainDivMarginLeft + "px",
            marginRight: s.mainDivMarginRight + "px",
            marginTop: s.mainDivMarginTop + "px",
            marginBottom: s.mainDivMarginBottom + "px",
        }}
        >
            {editing && editMode && (
                <EditablePopup
                    popupRef={popupRef}
                    controls={{
                        "Center of page Background ON/OFF": [s.mainDivBckGrndOn, v => updateMainPage("mainDivBckGrndOn", v)],
                        "Center Page Border Style": [s.mainDivBorderStyle, v => updateMainPage("mainDivBorderStyle", v)],
                        "Book Covers Box Background ON/OFF": [s.bookListDivBckGrndOn, v => updateMainPage("bookListDivBckGrndOn", v)],
                        "Book Covers Box Border Style": [s.bookListDivBorderStyle, v => updateMainPage("bookListDivBorderStyle", v)],

                        "Page Background Color 1": [s.pageBckColor, v => updateMainPage("pageBckColor", v)],
                        "Page Background Color 2": [s.pageBckColor2, v => updateMainPage("pageBckColor2", v)],
                        "Gradient Angle": [Number(s.gradientAngle), v => updateMainPage("gradientAngle", v)],

                        "Center of page Background Color 1": [s.mainDivBGColor, v => updateMainPage("mainDivBGColor", v)],
                        "Center of page Background Color 2": [s.mainDivBGColor2, v => updateMainPage("mainDivBGColor2", v)],
                        "Center Page Gradient Angle": [Number(s.mainDivGradientAngle), v => updateMainPage("mainDivGradientAngle", v)],
                        "Center Page Padding": [s.mainDivPadding, v => updateMainPage("mainDivPadding", v)],

                        "Center Page Border Size": [s.mainDivBorderSize, v => updateMainPage("mainDivBorderSize", v)],
                        "Center Page Border Color": [s.mainDivBorderColor, v => updateMainPage("mainDivBorderColor", v)],
                        "Center Page Border Radius": [s.mainDivBorderRadius, v => updateMainPage("mainDivBorderRadius", v)],

                        "Center Page Margin Left": [s.mainDivMarginLeft, v => updateMainPage("mainDivMarginLeft", v)],
                        "Center Page Margin Right": [s.mainDivMarginRight, v => updateMainPage("mainDivMarginRight", v)],
                        "Center Page Margin Top": [s.mainDivMarginTop, v => updateMainPage("mainDivMarginTop", v)],
                        "Center Page Margin Bottom": [s.mainDivMarginBottom, v => updateMainPage("mainDivMarginBottom", v)],

                        "Book Covers Box Background Color 1": [s.bookListDivBGColor, v => updateMainPage("bookListDivBGColor", v)],
                        "Book Covers Box Background Color 2": [s.bookListDivBGColor2, v => updateMainPage("bookListDivBGColor2", v)],
                        "Book Covers Box Gradient Angle": [Number(s.bookListDivGradientAngle), v => updateMainPage("bookListDivGradientAngle", v)],

                        "Book Covers Box Border Size": [s.bookListDivBorderSize, v => updateMainPage("bookListDivBorderSize", v)],
                        "Book Covers Box Border Color": [s.bookListDivBorderColor, v => updateMainPage("bookListDivBorderColor", v)],
                        "Book Covers Box Border Radius": [s.bookListDivBorderRadius, v => updateMainPage("bookListDivBorderRadius", v)],

                        "Book Covers Box Margin Left": [s.bookListDivMarginLeft, v => updateMainPage("bookListDivMarginLeft", v)],
                        "Book Covers Box Margin Right": [s.bookListDivMarginRight, v => updateMainPage("bookListDivMarginRight", v)],
                        "Book Covers Box Margin Top": [s.bookListDivMarginTop, v => updateMainPage("bookListDivMarginTop", v)],
                        "Book Covers Box Margin Bottom": [s.bookListDivMarginBottom, v => updateMainPage("bookListDivMarginBottom", v)],

                        "Book Covers Box Padding Left": [s.bookListDivPaddingLeft, v => updateMainPage("bookListDivPaddingLeft", v)],
                        "Book Covers Box Padding Right": [s.bookListDivPaddingRight, v => updateMainPage("bookListDivPaddingRight", v)],
                        "Book Covers Box Padding Top": [s.bookListDivPaddingTop, v => updateMainPage("bookListDivPaddingTop", v)],
                        "Book Covers Box Padding Bottom": [s.bookListDivPaddingBottom, v => updateMainPage("bookListDivPaddingBottom", v)],
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

            <div style={{
                background: (s.bookListDivBckGrndOn ? `linear-gradient(${s.bookListDivGradientAngle}deg, ${s.bookListDivBGColor},${s.bookListDivBGColor2})` : "none"),
                border: `${s.bookListDivBorderSize}px ${s.bookListDivBorderStyle} ${s.bookListDivBorderColor}`,
                borderRadius: s.bookListDivBorderRadius + "px",
                marginLeft: s.bookListDivMarginLeft + "px",
                marginRight: s.bookListDivMarginRight + "px",
                marginTop: s.bookListDivMarginTop + "px",
                marginBottom: s.bookListDivMarginBottom + "px",
                paddingLeft: s.bookListDivPaddingLeft + "px",
                paddingRight: s.bookListDivPaddingRight + "px",
                paddingTop: s.bookListDivPaddingTop + "px",
                paddingBottom: s.bookListDivPaddingBottom + "px",
            }}>
                <BookList
                    books={books}
                    editMode={editMode}
                    settings={settings}
                    deleteBook={deleteBook}
                    setBooks={setBooks}
                    setSettings={setSettings}
                />
            </div>
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
                            style={{ backgroundColor: "#ff2727b5", color: "black", borderRadius: "5px", position: "absolute" }}
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

            {editMode && (
                <button
                    onClick={(e) => {
                        setEditing(true);
                    }}
                    className={`${styles.buttonClass} ${styles.pageSettings}`}
                    style={{ backgroundColor: "#2699b8" }}
                >
                    Click for page settings
                </button>
            )}
            {editMode && (
                <button
                    onClick={addUserQuote}
                    className={`${styles.buttonClass} ${styles.addQuote}`}
                    style={{ backgroundColor: "#2699b8" }}
                >
                    Add a New Text Section
                </button>
            )}

            {menuOpen && (
                <div className={styles.dropdown}>

                    <button
                        className={styles.buttonClass}
                        onClick={() => navigate("/search")}
                        style={{ backgroundColor: "crimson" }}
                    >
                        <strong>Search for a book</strong>
                    </button>

                    <button
                        onClick={() => setEditMode(prev => !prev)}
                        className={styles.buttonClass}
                        style={{ backgroundColor: editMode ? "#da5858" : " #63cd8c" }}
                    >
                        {editMode ? "Done" : "Edit"}
                    </button>
                    {editMode && (
                        <button
                            onClick={() => saveSettings(books)}
                            className={styles.buttonClass}
                            style={{ backgroundColor: "#63cd8c" }}
                        >
                            Save Settings {saving && (<div className={styles.spinner}></div>)}
                        </button>
                    )}

                </div>
            )}
            <SiteInfoFooter />
        </div>
    );
}

export default UsersPage;