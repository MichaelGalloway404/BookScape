import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UsersPage() {
    const [user, setUser] = useState(null);
    const [books, setBooks] = useState([]);
    const [editMode, setEditMode] = useState(false);

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

    async function saveBookOrder(bookOrder) {
        const isbns = bookOrder.map(book => book.isbn);
        alert(isbns);
        try {
            await axios.post(
                "/api/users",
                {
                    bookOrderPref: isbns
                },
                { withCredentials: true }
            );

            alert("Book Order Saved!");
        } catch (err) {
            console.error(err);
            alert("Failed to Save!");
        }
    }


    if (!user) {
        return <p>Loading user...</p>;
    }

    return (
        <>
            <h1>User {user.username}'s Page</h1>

            {/* some ugly debug info, delete later */}
            <p><strong>Debug ID:</strong> {user.id}</p>
            <p><strong>Debug Username:</strong> {user.username}</p>
            <p><strong>Debug Book Order:</strong> {user.book_order}</p>

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
                    onClick={() => saveBookOrder(books)}
                > Save </button>
            )}

            {editMode === true ? <h4>Edit book order by dragging and dropping</h4> : <></>}

            {books.length === 0 ? (
                <p>No books added yet.</p>
            ) : (
                <ul style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    {books.map((book, i) => (
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
                    ))}
                </ul >
            )
            }
            <button onClick={() => navigate("/search")}>
                Search for a book
            </button>
        </>
    );
}

export default UsersPage;
