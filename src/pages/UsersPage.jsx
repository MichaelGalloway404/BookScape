import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SiteInfoFooter from '../components/SiteInfoFooter';
import ProfilePrivacyControls from "../components/ProfilePrivacyControls";
import BookList from "../components/BookList";
import styles from "./BookSearch.module.css"

function UsersPage() {
    const [user, setUser] = useState(null);
    const [profilePublic, setProfilePrivate] = useState(false);
    const [books, setBooks] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [settings, setSettings] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        // GET CURRENT USERS BOOKS
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
                // get books from database
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
                // check if this user has a private account in DB
                setProfilePrivate(data.private);
                setBooks(orderedBooks);
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
            alert("Book Order Saved!");
        } catch (err) {
            console.error("Axios error:", err.response?.data || err);
            alert("Failed to Save!");
        }
    }

    // make profile PUBLIC to others
    function setPublic() {
        // set db variable is profile private to false
        setProfilePrivate(false);
        alert("profile is set public, don't forget to save!");
    }
    // make profile PRIVATE to others
    function setPrivate() {
        // set db variable is profile private to true
        setProfilePrivate(true);
        alert("profile is set private, don't forget to save!");
    }

    if (!user) {
        return <p>Loading user...</p>;
    }

    return (
        <>
            <h1>User {user.username}'s Page</h1>

            {/* user profile public/private controls */}
            {editMode && (
                <ProfilePrivacyControls
                    profilePrivate={profilePublic}
                    setPublic={setPublic}
                    setPrivate={setPrivate}
                />
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

            {/* SAVE SETTINGS BUTTON */}
            {editMode && (
                <>
                    <button onClick={() => saveSettings(books)}>
                        Save
                    </button>

                    <h4>Edit book order by dragging and dropping</h4>
                </>
            )}

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

            <p>settings: {JSON.stringify(settings, null, 2)}</p>

            <SiteInfoFooter />
        </>
    );
}

export default UsersPage;
