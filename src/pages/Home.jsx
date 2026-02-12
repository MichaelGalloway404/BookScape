import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
    const [user, setUser] = useState(null);
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const loadUser = async () => {

            const res = await fetch("/api/publicUsers", {
                method: "GET",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error);
            }

            setUser(data);
            // get books
            const booksRes = await fetch("/api/userBooks", {
                method: "GET",
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
            setBooks(orderedBooks);
        };
        loadUser(); 
    }, []);

    return (
        <div>
            {/* some ugly debug info, delete later */}
            <p><strong>Debug ID:</strong> {user.id}</p>
            <p><strong>Debug Username:</strong> {user.username}</p>
            <p><strong>Debug Book Order:</strong> {user.book_order_json}</p>
            <h1>Home Page</h1>
            <button onClick={() => navigate("/login")}>
                Login
            </button>
            <button onClick={() => navigate("/signUp")}>
                Sign Up
            </button>
        </div>
    );
}

export default Home;
