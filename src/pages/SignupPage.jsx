import { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./SignupPage.module.css";

// simple sign up page 
function SignupPage() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signup = async (e) => {
    e.preventDefault();
    setError("");

    // user name and password to api
    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          password: password,
        }),
      });

      if (!res.ok) {
        throw new Error("Signup failed");
      }

      // success -> go to login
      navigate("/login");
    } catch (err) {
      setError("Username already exists");
    }
  };

  return (
    <div className={style.signupContainer}>
      <div className={style.signupCard}>
        <h1>Create Account</h1>
        <p>Sign up to get started</p>

        <form onSubmit={signup}>
          <div className={style.inputGroup}>
            <label>User Name</label>
            <input
              type="text"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className={style.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className={style.errorText}>{error}</p>}

          <button className={style.signupButton} type="submit">
            Sign Up
          </button>
        </form>

        <p className={style.footerText}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Sign in</span>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
