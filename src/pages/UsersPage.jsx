import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UsersPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
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
        setError("You are not logged in");
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
    </>
  );
}

export default UsersPage;
