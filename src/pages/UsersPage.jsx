import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SiteInfoFooter from '../components/SiteInfoFooter';

function UsersPage() {
    const [user, setUser] = useState(null);
    const [profilePublic, setProfilePrivate] = useState(false);
    const [books, setBooks] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [bgColor, setBgColor] = useState("#1523be");
    const [borderSize, setborderSize] = useState("2px");

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
            {editMode === true ?
                <h1>User {user.username}'s Page</h1>
                :
                <h1>User {user.username}'s Page <strong>Public: {profilePublic ? "False" : "True"}</strong></h1>
            }
            {editMode && (
                <>
                    {/* Public button */}
                    <button
                        onClick={() => setPublic()}
                    > Make profile public  </button>
                    {/* Private button */}
                    <button
                        onClick={() => setPrivate()}
                    > Make profile private </button>
                </>
            )}

            {/* some ugly debug info, delete later */}
            <p><strong>Debug ID:</strong> {user.id}</p>
            <p><strong>Debug Username:</strong> {user.username}</p>
            <p><strong>Debug Book Order:</strong> {user.book_order_json}</p>

            {/* Edit button for toggling user pref */}
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
                // Save button
                <button
                    onClick={() => saveSettings(books)}
                > Save </button>
            )}

            {editMode === true ? <h4>Edit book order by dragging and dropping</h4> : <></>}

            {books.length === 0 ? (
                <p>No books added yet.</p>
            ) : (
                <ul style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    {editMode && (
                        <input
                            type="color"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                        />)}
                    <select
                        value={borderSize}
                        onChange={(e) => setborderSize(e.target.value)}
                    >
                        <option value="1px">1px</option>
                        <option value="2px">2px</option>
                        <option value="3px">3px</option>
                        <option value="4px">4px</option>
                        <option value="5px">5px</option>
                        <option value="6px">6px</option>
                        <option value="7px">7px</option>
                        <option value="8px">8px</option>
                        <option value="9px">9px</option>
                        <option value="10px">10px</option>
                    </select>

                    {books.map((book, i) => (
                        <div style={{
                            backgroundColor: bgColor,
                            padding: "5px",
                            border: "2px solid black",
                            borderBlockWidth: borderSize,
                            borderRadius: "8px"
                        }}>

                            <li key={i} style={{ listStyle: "none" }}
                                draggable // Enables drag behavior
                                onDragStart={() => handleDragStart(i)} // hold on to item being dragged
                                onDragEnter={() => handleDragEnter(i)} // hold on to who we are hovering over
                                onDragEnd={handleDragEnd} // now re-order books
                                onDragOver={(e) => e.preventDefault()} // req for most browsers
                            >
                                <img
                                    src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                                    alt="Book cover"
                                />
                                <p>ISBN: {book.isbn}</p>
                                {editMode && (
                                    // delete button
                                    <button
                                        onClick={() => deleteBook(book)}
                                    > Delete </button>
                                )}
                            </li>

                        </div>
                    ))}
                </ul >
            )
            }
            <button onClick={() => navigate("/search")}>
                Search for a book
            </button>
            <SiteInfoFooter />
        </>
    );
}

export default UsersPage;
