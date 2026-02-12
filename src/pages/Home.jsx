import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
    const [user, setUser] = useState(null);
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
        };
        loadUser();
    }, []);

    return (
        <div>

            <h1>Home Page</h1>
            <ul style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {user.map((person, i) => (
                    <li key={i} style={{ listStyle: "none" }}>
                        {/* some ugly debug info, delete later */}
                        <p><strong>Debug ID:</strong> {person.id}</p>
                        <p><strong>Debug Username:</strong> {person.username}</p>
                        <p><strong>Debug Book Order:</strong> {person.book_order_json}</p>
                    </li>
                ))}
            </ul >
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
