import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UsersPage() {
    const [user, setUser] = useState(null);
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
            } catch (err) {
                console.error(err);
                navigate("/login");
            }
        };

        loadUser();
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
        </>
    );
}

export default UsersPage;
