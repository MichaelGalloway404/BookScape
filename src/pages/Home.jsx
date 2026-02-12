import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await fetch("/api/publicUsers", { method: "GET" });
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Failed to fetch users");

                setUsers(data);
            } catch (err) {
                console.error(err);
            }
        };

        loadUsers();
    }, []);

    return (
        <div>
            <h1>Home Page</h1>

            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <ul style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    {users.map((person, i) => (
                        <li key={i} style={{ listStyle: "none" }}>
                            <button
                                onClick={() =>
                                    navigate("/publicPage", {
                                        state: { user: person } // pass the whole person object
                                    })
                                }
                            >
                                <p><strong>Username:</strong> {person.username}</p>
                            </button>

                        </li>
                    ))}
                </ul>
            )}

            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/signUp")}>Sign Up</button>
        </div>
    );
}

export default Home;
