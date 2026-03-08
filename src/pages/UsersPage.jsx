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
    const [pageBckColor, setPageBckColor] = useState("#c4ccd5");
    const [pageBckColor2, setPageBckColor2] = useState("#c4ccd5");
    const [gradientAngle, setGradientAngle] = useState(135);

    const popupRef = useRef(null);
    const [popupPosition, setPopupPosition] = useState(null);

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
                pageBckColor,
                pageBckColor2,
                gradientAngle,
            },
        }));
    }, [pageBckColor, pageBckColor2, gradientAngle]);

    // Check for DB saved settings
    useEffect(() => {
        if (settings?.mainPage) {
            if (settings.mainPage.pageBckColor) setPageBckColor(settings.mainPage.pageBckColor);
            if (settings.mainPage.pageBckColor2) setPageBckColor2(settings.mainPage.pageBckColor2);
            if (settings.mainPage.gradientAngle) setGradientAngle(settings.mainPage.gradientAngle);
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
        try {
            await axios.post(
                "/api/currentUser",
                { privateStatus: profilePublic },
                { withCredentials: true }
            );
        } catch (err) {
            console.error(err);
            alert("Failed to Set");
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
            alert("Failed to book order!");
        }

        try {
            await axios.post(
                "/api/userSettings",
                settings,
                { withCredentials: true }
            );

            alert("Profile Settings Saved!");
        } catch (err) {
            console.error(err);
            alert("Failed to Save!");
        }
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
        <>
            {editing && editMode && (
                <EditablePopup
                    popupRef={popupRef}
                    initialPosition={popupPosition}
                    controls={{
                        "Page Background Color 1": [pageBckColor, setPageBckColor],
                        "Page Background Color 2": [pageBckColor2, setPageBckColor2],
                        "Gradient Angle": [Number(gradientAngle), setGradientAngle],
                        "Profile is Private": [profilePublic, setProfilePrivate],
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

            {/* USER QUOTES */}
            {settings?.mainPage?.userQuotes?.map((quoteKey) => (
                <TextComponent
                    key={quoteKey}
                    ComponentName={quoteKey}
                    defaultText={"Type something"}
                    textMutable={true}
                    editMode={editMode}
                    settings={settings}
                    setSettings={setSettings}
                />
            ))}

            {/* ADD QUOTE BUTTON */}
            {editMode && (
                <button
                    onClick={addUserQuote}
                    className={styles.buttonClass}
                >
                    Add Text Section
                </button>
            )}

            <BookList
                books={books}
                editMode={editMode}
                settings={settings}
                deleteBook={deleteBook}
                setBooks={setBooks}
                setSettings={setSettings}
            />

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
            >
                {editMode ? "Done" : "Edit"}
            </button>

            {editMode && (
                <button
                    onClick={(e) => {
                        setPopupPosition({
                            x: e.pageX,
                            y: e.pageY,
                        });
                        setEditing(true);
                    }}
                    className={styles.buttonClass}
                >
                    Click for page settings
                </button>
            )}

            {editMode && (
                <button
                    onClick={() => saveSettings(books)}
                    className={styles.buttonClass}
                >
                    Save
                </button>
            )}
        </>
    );
}

export default UsersPage;