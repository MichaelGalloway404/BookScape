// import { useNavigate } from "react-router-dom";
import { useState } from "react";
import style from './LoginPage.module.css'

function LoginPage() {

    // const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const showInfo = () => {
        alert(userName);
        alert(password);
    }

    // simple sesson login test for learning
    const login = (e) => {
        e.preventDefault();

        // TEMP: fake auth check
        if (userName === "root" && password === "root") {
            localStorage.setItem("isAuthenticated", "true");
            navigate("/second");
        } else {
            alert("Invalid login");
        }
    };
    return (
        <>
            <div className={style.loginContainer}>
                <div className={style.loginCard}>
                    <h1>Welcome Back</h1>
                    <p>Please sign in to your account</p>
                    <button onClick={showInfo} />
                    <form>
                        <div className={style.inputGroup}>
                            <label>User Name</label>
                            <input
                                type="userName"
                                placeholder="exampleN@me"
                                required
                                onChange={(e) => setUserName(e.target.value)} />
                        </div>

                        <div className={style.inputGroup}>
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        {/* display username password for now */}
                        <button className={style.loginButton} type="submit">Sign In</button>
                    </form>
                    <button className={style.loginButton} onClick={login}>LOGIN TEST</button>
                    <div className={style.footerText}>
                    </div>
                </div>
                {/* <button onClick={() => navigate("/second")}>
                    Go to Database Page
                </button> */}

                {/* <button onClick={() => navigate("/")}>
                    Return Home
                </button> */}
            </div>
        </>
    );
}

export default LoginPage;
