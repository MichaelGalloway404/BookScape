import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./Home.module.css"

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
        <div className={styles.container}>
            <h1 className={styles.title}>Book Scape</h1>

            {users.length === 0 ? (
                <p>Loading Users...</p>
            ) : (
                <ul style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    {users.map((person, i) => (
                        <li className={styles.profilesGrid} key={i}>
                            <button className={`${styles.buttonClass} ${styles.profileBtn}`}
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
            <div className={styles.navButtons}>
            <button className={`${styles.buttonClass} ${styles.primary}`} onClick={() => navigate("/login")}>Login</button>
            <button className={styles.buttonClass} onClick={() => navigate("/signUp")}>Sign Up</button>
            <button className={styles.buttonClass} onClick={() => navigate("/colorTester")}>color Tester Page</button>
            </div>
        </div>
    );
}

export default Home;
