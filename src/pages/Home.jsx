import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./Home.module.css"

function Home() {
    // State to store the list of users fetched from the database
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // Fetch public users on component mount
    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/publicUsers");
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to fetch users");
            }

            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Book Scape</h1>

            {/* Conditional Rendering: Show a loading spinner until users are loaded */}
            {loading ? (
                <div style={{ textAlign: "center", margin: "50px" }}>
                    <p style={{ color: "white" }}>Loading Users...</p>
                    <div className={styles.spinner}></div>
                </div>
            ) : error ? (
                <div style={{ textAlign: "center", margin: "50px" }}>
                    <p style={{ color: "red" }}>
                        Error loading users: {error}
                    </p>
                    <button
                        className={styles.buttonClass}
                        onClick={loadUsers}
                    >
                        Try Again
                    </button>
                </div>
            ) : users.length === 0 ? (
                <div style={{ textAlign: "center", margin: "50px" }}>
                    <p style={{ color: "white" }}>No public users found.</p>
                </div>
            ) : (
                // Displaying user profiles in a flexible grid layout
                <ul
                    style={{
                        display: "flex",
                        gap: "1rem",
                        flexWrap: "wrap",
                    }}
                >
                    {users.map((person, i) => (

                        <li className={styles.profilesGrid} key={i}>
                            {/* 
                                Navigation trick: When clicked, we pass the user's data 
                                (id, username, book_order_json) via React Router "state".
                                This avoids an extra API call on the next page.
                            */}
                            <button
                                className={`${styles.buttonClass} ${styles.profileBtn}`}
                                onClick={() =>
                                    navigate("/publicPage", {
                                        state: { user: person },
                                    })
                                }
                            >
                                <p>
                                    <strong>Username:</strong>{" "}
                                    {person.username}
                                </p>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {/* Global navigation for visitors to join or sign in */}
            <div className={styles.navButtons}>
                <button
                    className={`${styles.buttonClass} ${styles.primary}`}
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>

                <button
                    className={styles.buttonClass}
                    onClick={() => navigate("/signUp")}
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
}

export default Home;