import { useNavigate } from "react-router-dom";
import { useState } from "react";
import style from './LoginPage.module.css'

function LoginPage() {

    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const showUserInfo = () =>{
        alert(password);
        alert(userName);
    }

    return (
        <>
            <div className={style.loginContainer}>
                <div className={style.loginCard}>
                    <h1>Welcome Back</h1>
                    <p>Please sign in to your account</p>
                    {/* display username password for now */}
                    <button onClick={showUserInfo}>Show Info</button>

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

                        <button className={style.loginButton} type="submit">Sign In</button>
                    </form>

                    <div className={style.footerText}>
                        {/* <a href="#">Forgot password?</a> */}
                    </div>
                </div>
                <button onClick={() => navigate("/")}>
                    Return Home
                </button>
            </div>
        </>
    );
}

export default LoginPage;
