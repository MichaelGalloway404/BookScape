import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UsersPage() {
    const [user, setUser] = useState(null);
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUserAndBooks = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error("No token found");
                }

                const userRes = await fetch("/api/currentUser", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const userData = await userRes.json();

                if (!userRes.ok) {
                    throw new Error(userData.error || "Not authenticated");
                }

                setUser(userData);

                const booksRes = await fetch("/api/userBooks", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const booksData = await booksRes.json();

                if (!booksRes.ok) {
                    throw new Error(booksData.error || "Failed to load books");
                }

                setBooks(booksData);
            } catch (err) {
                console.error(err);
                navigate("/login");
            }
        };

        loadUserAndBooks();
    }, [navigate]);


    if (!user) {
        return <p>Loading user...</p>;
    }

    return (
        <>
            <h1>Users Page</h1>

            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Username:</strong> {user.username}</p>

            <button onClick={() => navigate("/search")}>
                Search for a book
            </button>

            <h2>Your Books</h2>

            {books.length === 0 ? (
                <p>No saved books yet.</p>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                    {books.map(book => (
                        <div key={book.id} style={{ width: "150px" }}>
                            <img
                                src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                                alt="Book cover"
                                style={{ width: "100%" }}
                            />
                            <p style={{ fontSize: "12px" }}>
                                ISBN: {book.isbn || "N/A"}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default UsersPage;
