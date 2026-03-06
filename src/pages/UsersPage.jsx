import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SiteInfoFooter from '../components/SiteInfoFooter';
import BookList from "../components/BookList";
import TextComponent from "../components/TextComponent";
import styles from "./BookSearch.module.css"
import EditablePopup from "../components/EditablePopup"
import style from "./UsersPage.module.css"

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

    // // add any changes to settings the user makes
    // useEffect(() => {
    //     setSettings(prev => ({
    //         ...prev,
    //         mainPage: {
    //             ...prev.mainPage,
    //             pageBckColor,
    //             pageBckColor2,
    //             gradientAngle,
    //         },
    //     }));
    // }, [pageBckColor, pageBckColor2, gradientAngle, setSettings]);

    // // Check for DataBase saved settings
    // useEffect(() => {
    //     if (settings?.mainPage) {
    //         setPageBckColor(settings.mainPage.pageBckColor);
    //         setPageBckColor2(settings.mainPage.pageBckColor2);
    //         setGradientAngle(settings.mainPage.gradientAngle);
    //     }
    // }, [settings]);

    // will load color for background from user settings later
    useEffect(() => {
        // Save original background
        const originalBackground = document.body.style.background;

        // Apply gradient background
        document.body.style.background = `linear-gradient(${gradientAngle}deg, ${pageBckColor}, ${pageBckColor2})`;

        // Cleanup when component unmounts
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

    // loading user info 
    useEffect(() => {
        // LOAD CURRENT USER
        const loadUser = async () => {
            try {
                // GET USER AUTH
                const res = await fetch("/api/currentUser", {
                    method: "GET",
                    credentials: "include",
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Not authenticated");
                }

                setUser(data);
                // GET CURRENT USERS BOOKS
                const booksRes = await fetch("/api/userBooks", {
                    method: "GET",
                    credentials: "include",
                });

                const booksData = await booksRes.json();
                if (booksRes.ok) {
                    setBooks(booksData);
                }
                // if user has save a preferred ordering of their books apply it
                let orderedBooks = booksData;
                // If book_order_json exists sort books to users preferred order
                if (Array.isArray(data.book_order_json) && data.book_order_json.length > 0) {
                    const orderMap = new Map(data.book_order_json.map((isbn, index) => [isbn, index]));
                    orderedBooks = booksData.slice().sort((a, b) => {
                        const aIndex = orderMap.get(a.isbn);
                        const bIndex = orderMap.get(b.isbn);

                        // If both exist in book_order_json, sort by index
                        if (aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex;
                        // If only a exists, a comes first
                        if (aIndex !== undefined) return -1;
                        // If only b exists, b comes first
                        if (bIndex !== undefined) return 1;
                        // Otherwise maintain original order
                        return 0;
                    });
                }
                // GET USER SETTINGS
                const userSettingsRes = await fetch("/api/userSettings", {
                    method: "GET",
                    credentials: "include",
                });

                const userSettingsData = await userSettingsRes.json();

                if (userSettingsRes.ok) {
                    setSettings(userSettingsData || {}); // stores all keys from DB
                }

                // SET PROFILE VISIBILITY
                setProfilePrivate(data.private);

                // SET BOOK ORDERING
                setBooks(orderedBooks);

                // Finished loading user data
                setLoading(false);
            } catch (err) {
                console.error(err);
                navigate("/login");
            }
        };

        loadUser();
    }, [navigate]);

    // DELETE A BOOK
    async function deleteBook(book) {
        try {
            const res = await fetch("/api/userBooks", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    isbn: book.isbn,
                    cover_id: book.cover_id,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to delete book");
            }

            // remove from UI without refetch
            setBooks(prev =>
                prev.filter(
                    b => !(b.isbn === book.isbn && b.cover_id === book.cover_id)
                )
            );
        } catch (err) {
            console.error(err);
        }
    }

    // SAVE USER'S SETTINGS
    async function saveSettings(bookOrder) {
        // save user's profile a s public/private
        try {
            await axios.post(
                "/api/currentUser",
                { privateStatus: profilePublic },
                { withCredentials: true }
            );
        } catch (err) {
            console.error("Axios error:", err.response?.data || err);
            alert("Failed to Set");
        }
        // save user's preferred book order
        const isbns = bookOrder.map(book => String(book.isbn));
        try {
            await axios.post(
                "/api/currentUser",
                { bookOrderPref: isbns },
                { withCredentials: true }
            );
        } catch (err) {
            console.error("Axios error:", err.response?.data || err);
            alert("Failed to book order!");
        }
        // save user's settings
        try {
            await axios.post(
                "/api/userSettings",
                settings,
                { withCredentials: true }
            );
            alert("Profile Settings Saved!");
        } catch (err) {
            console.error("Axios error:", err.response?.data || err);
            alert("Failed to Save!");
        }
    }

    // loading screen
    if (!user || loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <p>Loading page...</p>
                {/* optional spinner */}
                <div className={style.spinner}></div>
            </div>
        );
    }

    return (
        <>
            {/* if in editmode and element has been clicked on */}
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
            {/* Users chosen title */}
            <TextComponent
                ComponentName={"UserPageTitle"}
                defaultText={"Make a page Title " + user.username}
                textMutable={true}
                editMode={editMode}
                settings={settings}
                setSettings={setSettings}
            />

            {/* display users bio and edits */}
            <TextComponent
                ComponentName={"UserBio"}
                defaultText={"Type your " + user.username + "Bio here..."}
                textMutable={true}
                editMode={editMode}
                settings={settings}
                setSettings={setSettings}
            />

            {/* PAGE SETTINGS BUTTON */}
            {editMode && (
                <button onClick={(e) => {
                    if (editMode) {
                        setPopupPosition({
                            x: e.pageX,
                            y: e.pageY,
                        });
                        setEditing(true);
                    }
                }}
                    style={{
                        position: "absolute",
                        top: "6rem",
                        right: "1rem",
                    }}>
                    Click for page settings
                </button>
            )}
            {/* SAVE SETTINGS BUTTON */}
            {editMode && (
                <button onClick={() => saveSettings(books)}
                    style={{
                        position: "absolute",
                        top: "3rem",
                        right: "1rem",
                    }}>
                    Save
                </button>
            )}
            {/* EDIT MODE BUTTON */}
            <button
                onClick={() => setEditMode(prev => !prev)}
                style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                }}
            >
                {editMode ? "Done" : "Edit"}
            </button>

            {/* component for listing out users books and deleting books*/}
            <BookList
                books={books}
                editMode={editMode}
                settings={settings}
                deleteBook={deleteBook}
                setBooks={setBooks}
                setSettings={setSettings}
            />

            {/* search for book button */}
            <button className={`${styles.buttonClass}`} onClick={() => navigate("/search")}>
                Search for a book
            </button>

            {/* <p>settings: {JSON.stringify(settings, null, 2)}</p> */}

            <SiteInfoFooter />
        </>
    );
}

export default UsersPage;
