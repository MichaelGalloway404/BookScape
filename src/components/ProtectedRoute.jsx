import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null); // null = loading

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/currentUser", {
          credentials: "include",
        });
        setIsAuth(res.ok);
      } catch (err) {
        console.error(err);
        setIsAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuth === null) return <p>Loading...</p>;
  if (!isAuth) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;
