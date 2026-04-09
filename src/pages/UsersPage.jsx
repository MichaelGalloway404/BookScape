import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BookList from "../components/BookList";
import TextComponent from "../components/TextComponent";
import EditablePopup from "../components/EditablePopup";
import styles from "./UsersPage.module.css";
import SiteInfoFooter from "../components/SiteInfoFooter";

function UsersPage() {
    const [user, setUser] = useState(null);
    const [books, setBooks] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editing, setEditing] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const popupRef = useRef(null);
    const navigate = useNavigate();

    // =========================
    // SINGLE CONFIG OBJECT
    // =========================
    const [config, setConfig] = useState({
        mainPage: {
            pageBckColor: "#c4ccd5",
            pageBckColor2: "#c4ccd5",
            gradientAngle: 0,

            mainDiv: {
                gradientAngle: 0,
                bgColor1: "white",
                bgColor2: "white",
                padding: 0,
                borderSize: 0,
                borderStyle: "solid",
                borderColor: "black",
                borderRadius: 0,
                margin: { left: 0, right: 0, top: 0, bottom: 0 },
                backgroundOn: true,
            },

            bookListDiv: {
                gradientAngle: 0,
                bgColor1: "white",
                bgColor2: "white",
                borderSize: 0,
                borderStyle: "solid",
                borderColor: "black",
                borderRadius: 0,
                margin: { left: 0, right: 0, top: 0, bottom: 0 },
                padding: { left: 0, right: 0, top: 0, bottom: 0 },
                backgroundOn: true,
            },

            userQuotes: [],
        },
    });

    // =========================
    // GENERIC UPDATE FUNCTION
    // =========================
    function updateConfig(path, value) {
        setConfig(prev => {
            const newConfig = structuredClone(prev);
            let cur = newConfig;

            for (let i = 0; i < path.length - 1; i++) {
                cur = cur[path[i]];
            }

            cur[path[path.length - 1]] = value;
            return newConfig;
        });
    }

    // =========================
    // APPLY BODY BACKGROUND
    // =========================
    useEffect(() => {
        const { pageBckColor, pageBckColor2, gradientAngle } = config.mainPage;

        const original = document.body.style.background;
        document.body.style.background =
            `linear-gradient(${gradientAngle}deg, ${pageBckColor}, ${pageBckColor2})`;

        return () => (document.body.style.background = original);
    }, [config.mainPage.pageBckColor, config.mainPage.pageBckColor2, config.mainPage.gradientAngle]);

    // =========================
    // CLOSE POPUP
    // =========================
    useEffect(() => {
        function handleClickOutside(e) {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setEditing(false);
            }
        }

        if (editing) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [editing]);

    // =========================
    // LOAD USER + DATA
    // =========================
    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await fetch("/api/currentUser", { credentials: "include" });
                const data = await res.json();
                if (!res.ok) throw new Error();

                setUser(data);

                const booksRes = await fetch("/api/userBooks", { credentials: "include" });
                const booksData = await booksRes.json();

                let orderedBooks = booksData;

                if (Array.isArray(data.book_order_json)) {
                    const map = new Map(data.book_order_json.map((isbn, i) => [isbn, i]));
                    orderedBooks = booksData.slice().sort((a, b) => {
                        return (map.get(a.isbn) ?? 9999) - (map.get(b.isbn) ?? 9999);
                    });
                }

                setBooks(orderedBooks);

                const settingsRes = await fetch("/api/userSettings", { credentials: "include" });
                if (settingsRes.ok) {
                    setConfig(await settingsRes.json());
                }

                setLoading(false);
            } catch {
                navigate("/login");
            }
        };

        loadUser();
    }, [navigate]);

    // =========================
    // DELETE BOOK
    // =========================
    async function deleteBook(book) {
        await fetch("/api/userBooks", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(book),
        });

        setBooks(prev => prev.filter(b => b.isbn !== book.isbn));
    }

    // =========================
    // ADD TEXT SECTION
    // =========================
    function addUserQuote() {
        const quotes = config.mainPage.userQuotes || [];
        const newKey = `UserQuote_${quotes.length + 1}`;

        updateConfig(["mainPage", "userQuotes"], [...quotes, newKey]);
    }

    // =========================
    // DELETE TEXT SECTION
    // =========================
    function deleteUserQuote(key) {
        const quotes = config.mainPage.userQuotes.filter(q => q !== key);
        updateConfig(["mainPage", "userQuotes"], quotes);

        const newConfig = { ...config };
        delete newConfig[key];
        setConfig(newConfig);
    }

    // =========================
    // SAVE SETTINGS
    // =========================
    async function saveSettings() {
        setSaving(true);

        try {
            await axios.post("/api/userSettings", config, { withCredentials: true });
        } catch (err) {
            console.error(err);
        }

        setSaving(false);
    }

    if (loading) return <div>Loading...</div>;

    const mainDiv = config.mainPage.mainDiv;
    const bookDiv = config.mainPage.bookListDiv;

    return (
        <div
            style={{
                background: mainDiv.backgroundOn
                    ? `linear-gradient(${mainDiv.gradientAngle}deg, ${mainDiv.bgColor1}, ${mainDiv.bgColor2})`
                    : "none",
                padding: mainDiv.padding,
                border: `${mainDiv.borderSize}px ${mainDiv.borderStyle} ${mainDiv.borderColor}`,
                borderRadius: mainDiv.borderRadius,
                margin: `${mainDiv.margin.top}px ${mainDiv.margin.right}px ${mainDiv.margin.bottom}px ${mainDiv.margin.left}px`,
            }}
        >
            {editing && editMode && (
                <EditablePopup
                    popupRef={popupRef}
                    controls={{
                        "Page Background Color 1": [
                            config.mainPage.pageBckColor,
                            v => updateConfig(["mainPage", "pageBckColor"], v),
                        ],
                        "Page Background Color 2": [
                            config.mainPage.pageBckColor2,
                            v => updateConfig(["mainPage", "pageBckColor2"], v),
                        ],
                    }}
                />
            )}

            <TextComponent
                ComponentName="UserPageTitle"
                defaultText={"Title " + user.username}
                textMutable
                editMode={editMode}
                settings={config}
                setSettings={setConfig}
            />

            <TextComponent
                ComponentName="UserBio"
                defaultText={"Bio here..."}
                textMutable
                editMode={editMode}
                settings={config}
                setSettings={setConfig}
            />

            <div
                style={{
                    background: bookDiv.backgroundOn
                        ? `linear-gradient(${bookDiv.gradientAngle}deg, ${bookDiv.bgColor1}, ${bookDiv.bgColor2})`
                        : "none",
                    border: `${bookDiv.borderSize}px ${bookDiv.borderStyle} ${bookDiv.borderColor}`,
                    borderRadius: bookDiv.borderRadius,
                }}
            >
                <BookList
                    books={books}
                    editMode={editMode}
                    settings={config}
                    deleteBook={deleteBook}
                    setBooks={setBooks}
                    setSettings={setConfig}
                />
            </div>

            {config.mainPage.userQuotes.map(key => (
                <div key={key}>
                    <TextComponent
                        ComponentName={key}
                        defaultText="Type something"
                        textMutable
                        editMode={editMode}
                        settings={config}
                        setSettings={setConfig}
                    />

                    {editMode && (
                        <button onClick={() => deleteUserQuote(key)}>
                            Delete Section
                        </button>
                    )}
                </div>
            ))}

            <button onClick={() => setMenuOpen(prev => !prev)}>☰</button>

            {menuOpen && (
                <div>
                    <button onClick={() => navigate("/search")}>
                        Search
                    </button>

                    <button onClick={() => setEditMode(p => !p)}>
                        {editMode ? "Done" : "Edit"}
                    </button>

                    {editMode && (
                        <button onClick={saveSettings}>
                            Save {saving && "..."}
                        </button>
                    )}
                </div>
            )}

            {editMode && <button onClick={addUserQuote}>Add Section</button>}

            <SiteInfoFooter />
        </div>
    );
}

export default UsersPage;