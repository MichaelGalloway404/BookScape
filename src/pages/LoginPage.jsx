import { useNavigate } from "react-router-dom";
import { useState } from "react";
import style from './LoginPage.module.css'
import SiteInfoFooter from '../components/SiteInfoFooter';

// authenticate and loggin a user
function LoginPage() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const login = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/login", {
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
                throw new Error("Invalid credentials");
            }

            const data = await res.json();

            // store JWT
            localStorage.setItem("token", data.token);

            navigate("/second");
        } catch (err) {
            alert("Login failed");
        }
    };

    return (
        <>
            <div className={style.loginContainer}>
                <div className={style.loginCard}>
                    <h1>Welcome Back</h1>
                    <p>Please sign in to your account</p>
                    <form onSubmit={login}>
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

                        <button className={style.loginButton} type="submit">
                            Sign In
                        </button>
                    </form>

                    <div className={style.footerText}> im footer
                    </div>
                </div>
            </div>
            <SiteInfoFooter/>
        </>
    );
}

export default LoginPage;
