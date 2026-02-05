import { useEffect, useState } from "react";
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
                    credentials: "include",
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Not authenticated");
                }

                setUser(data);
                // get books
                const booksRes = await fetch("/api/userBooks", {
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


    if (!user) {
        return <p>Loading user...</p>;
    }

    return (
        <>
            <h1>Users Page</h1>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Username:</strong> {user.username}</p>
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


            {books.length === 0 ? (
                <p>No books added yet.</p>
            ) : (
                <ul style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    {books.map((book, i) => (
                        <li key={i} style={{ listStyle: "none" }}>
                            <img
                                src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                                alt="Book cover"
                            />
                            <p>ISBN: {book.isbn}</p>
                            {editMode && (
                                <button
                                    onClick={() => deleteBook(book)}

                                >
                                    X
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={() => navigate("/search")}>
                Search for a book
            </button>
        </>
    );
}

export default UsersPage;
