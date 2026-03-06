import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SiteInfoFooter from '../components/SiteInfoFooter';
import BookList from "../components/BookList";
import TextComponent from "../components/TextComponent";
import EditablePopup from "../components/EditablePopup";
import styles from "./BookSearch.module.css";
import style from "./UsersPage.module.css";

function UsersPage() {
    const [user, setUser] = useState(null);
    const [profilePublic, setProfilePrivate] = useState(false);
    const [books, setBooks] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editing, setEditing] = useState(false);
    const [settings, setSettings] = useState({
        mainPage: {
            pageBckColor: "#c4ccd5",
            pageBckColor2: "#c4ccd5",
            gradientAngle: 135,
        }
    });
    const popupRef = useRef(null);
    const [popupPosition, setPopupPosition] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Apply gradient background directly from settings
    useEffect(() => {
        const originalBackground = document.body.style.background;
        const { pageBckColor, pageBckColor2, gradientAngle } = settings.mainPage;

        document.body.style.background = `linear-gradient(${gradientAngle}deg, ${pageBckColor}, ${pageBckColor2})`;

        return () => {
            document.body.style.background = originalBackground;
        };
    }, [settings.mainPage]);

    // Close popup if click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setEditing(false);
            }
        }

        if (editing) document.addEventListener("mousedown", handleClickOutside);
        else document.removeEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [editing]);

    // Load user info, books, and settings
    useEffect(() => {
        const loadUser = async () => {
            try {
                // Get authenticated user
                const res = await fetch("/api/currentUser", {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Not authenticated");

                setUser(data);
                setProfilePrivate(data.private);

                // Get user books
                const booksRes = await fetch("/api/userBooks", {
                    method: "GET",
                    credentials: "include",
                });
                const booksData = await booksRes.json();
                if (booksRes.ok) setBooks(booksData);

                // Apply user's preferred book order if exists
                let orderedBooks = booksData;
                if (Array.isArray(data.book_order_json) && data.book_order_json.length > 0) {
                    const orderMap = new Map(data.book_order_json.map((isbn, index) => [isbn, index]));
                    orderedBooks = booksData.slice().sort((a, b) => {
                        const aIndex = orderMap.get(a.isbn);
                        const bIndex = orderMap.get(b.isbn);
                        if (aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex;
                        if (aIndex !== undefined) return -1;
                        if (bIndex !== undefined) return 1;
                        return 0;
                    });
                }
                setBooks(orderedBooks);

                // Load user settings
                const userSettingsRes = await fetch("/api/userSettings", {
                    method: "GET",
                    credentials: "include",
                });
                const userSettingsData = await userSettingsRes.json();
                if (userSettingsRes.ok) {
                    const s = userSettingsData || {};
                    s.mainPage = s.mainPage || {
                        pageBckColor: "#c4ccd5",
                        pageBckColor2: "#c4ccd5",
                        gradientAngle: 135,
                    };
                    setSettings(s);
                }

                setLoading(false);
            } catch (err) {
                console.error(err);
                navigate("/login");
            }
        };

        loadUser();
    }, [navigate]);

    // Delete a book
    async function deleteBook(book) {
        try {
            const res = await fetch("/api/userBooks", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ isbn: book.isbn, cover_id: book.cover_id }),
            });
            if (!res.ok) throw new Error("Failed to delete book");

            setBooks(prev => prev.filter(b => !(b.isbn === book.isbn && b.cover_id === book.cover_id)));
        } catch (err) {
            console.error(err);
        }
    }

    // Save user settings
    async function saveSettings(bookOrder) {
        try {
            await axios.post("/api/currentUser", { privateStatus: profilePublic }, { withCredentials: true });
        } catch (err) {
            console.error(err.response?.data || err);
            alert("Failed to set profile visibility");
        }

        const isbns = bookOrder.map(book => String(book.isbn));
        try {
            await axios.post("/api/currentUser", { bookOrderPref: isbns }, { withCredentials: true });
        } catch (err) {
            console.error(err.response?.data || err);
            alert("Failed to save book order");
        }

        try {
            await axios.post("/api/userSettings", settings, { withCredentials: true });
            alert("Profile settings saved!");
        } catch (err) {
            console.error(err.response?.data || err);
            alert("Failed to save settings");
        }
    }

    if (!user || loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <p>Loading page...</p>
                <div className={style.spinner}></div>
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
                        "Page Background Color 1": [settings.mainPage.pageBckColor, val =>
                            setSettings(prev => ({ ...prev, mainPage: { ...prev.mainPage, pageBckColor: val } }))
                        ],
                        "Page Background Color 2": [settings.mainPage.pageBckColor2, val =>
                            setSettings(prev => ({ ...prev, mainPage: { ...prev.mainPage, pageBckColor2: val } }))
                        ],
                        "Gradient Angle": [settings.mainPage.gradientAngle, val =>
                            setSettings(prev => ({ ...prev, mainPage: { ...prev.mainPage, gradientAngle: val } }))
                        ],
                        "Profile is Private": [profilePublic, setProfilePrivate],
                    }}
                />
            )}

            <TextComponent
                ComponentName="UserPageTitle"
                defaultText={`Make a page Title ${user.username}`}
                textMutable={true}
                editMode={editMode}
                settings={settings}
                setSettings={setSettings}
            />

            <TextComponent
                ComponentName="UserBio"
                defaultText={`Type your ${user.username} Bio here...`}
                textMutable={true}
                editMode={editMode}
                settings={settings}
                setSettings={setSettings}
            />

            {editMode && (
                <button
                    onClick={(e) => {
                        setPopupPosition({ x: e.pageX, y: e.pageY });
                        setEditing(true);
                    }}
                    style={{ position: "absolute", top: "6rem", right: "1rem" }}
                >
                    Click for page settings
                </button>
            )}

            {editMode && (
                <button
                    onClick={() => saveSettings(books)}
                    style={{ position: "absolute", top: "3rem", right: "1rem" }}
                >
                    Save
                </button>
            )}

            <button
                onClick={() => setEditMode(prev => !prev)}
                style={{ position: "absolute", top: "1rem", right: "1rem" }}
            >
                {editMode ? "Done" : "Edit"}
            </button>

            <BookList
                books={books}
                editMode={editMode}
                settings={settings}
                deleteBook={deleteBook}
                setBooks={setBooks}
                setSettings={setSettings}
            />

            <button className={styles.buttonClass} onClick={() => navigate("/search")}>
                Search for a book
            </button>

            <SiteInfoFooter />
        </>
    );
}

export default UsersPage;