import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SiteInfoFooter from '../components/SiteInfoFooter';
import ProfilePrivacyControls from "../components/ProfilePrivacyControls";
import BookStyleControls from "../components/BookStyleControls";
import BookList from "../components/BookList";



function UsersPage() {
    const [user, setUser] = useState(null);
    const [profilePublic, setProfilePrivate] = useState(false);
    const [books, setBooks] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [bgColor, setBgColor] = useState("#1523be");
    const [borderColor, setBorderColor] = useState("#181b44");
    const [borderSize, setBorderSize] = useState("2");

    const navigate = useNavigate();

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
                // get books
                const booksRes = await fetch("/api/userBooks", {
                    method: "GET",
                    credentials: "include",
                });

                const booksData = await booksRes.json();
                if (booksRes.ok) {
                    setBooks(booksData);
                }
                let orderedBooks = booksData;
                // If book_order_json exists and is non-empty, sort books
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

    // Item being dragged
    const dragItem = useRef(null);
    // DragOverItem will hold the index of the item currently being dragged over
    const dragOverItem = useRef(null);
    const handleDragStart = (index) => {
        // Store the index of the dragged item in the ref
        dragItem.current = index;
    };
    const handleDragEnter = (index) => {
        // Store the index of the item being hovered over
        dragOverItem.current = index;
    };

    // book has been dropped
    const handleDragEnd = () => {
        // If either ref is null, something went wrong, and only allow if in edit mode
        if (dragItem.current === null || dragOverItem.current === null || !editMode) return;
        // Shallow copy of existing book order
        const listCopy = [...books];
        // Save the content of the dragged item
        const draggedItemContent = listCopy[dragItem.current];

        // Remove the dragged item from its original position
        listCopy.splice(dragItem.current, 1);
        // Insert the dragged item into the new position
        listCopy.splice(dragOverItem.current, 0, draggedItemContent);

        // Reset refs
        dragItem.current = null;
        dragOverItem.current = null;

        // Update state with new order and trigger UI re-render
        setBooks(listCopy);
    };

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
            alert("Could not remove book");
        }
    }

    async function saveSettings(bookOrder) {
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

    // make profile visible
    function setPublic() {
        // set db variable is profile private to false
        setProfilePrivate(false);
        alert("profile is set public, don't forget to save!");
    }
    // make profile invisible to others
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

            {editMode && (
                <ProfilePrivacyControls
                    profilePrivate={profilePublic}
                    setPublic={setPublic}
                    setPrivate={setPrivate}
                />
            )}

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

            {editMode && (
                <>
                    <button onClick={() => saveSettings(books)}>
                        Save
                    </button>

                    <h4>Edit book order by dragging and dropping</h4>

                    <BookStyleControls
                        bgColor={bgColor}
                        borderColor={borderColor}
                        borderSize={borderSize}
                        setBgColor={setBgColor}
                        setBorderColor={setBorderColor}
                        setBorderSize={setBorderSize}
                    />
                </>
            )}

            <BookList
                books={books}
                editMode={editMode}
                bgColor={bgColor}
                borderColor={borderColor}
                borderSize={borderSize}
                handleDragStart={handleDragStart}
                handleDragEnter={handleDragEnter}
                handleDragEnd={handleDragEnd}
                deleteBook={deleteBook}
            />

            <button onClick={() => navigate("/search")}>
                Search for a book
            </button>

            <SiteInfoFooter />

        </>
    );
}

export default UsersPage;
