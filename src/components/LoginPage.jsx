import { useNavigate } from "react-router-dom";
import style from './LoginPage.module.css'

function LoginPage() {

    const navigate = useNavigate();

    return (
        <>
            <div className={style.loginContainer}>
                <div className={style.loginCard}>
                    <h1>Welcome Back</h1>
                    <p>Please sign in to your account</p>

                    <form>
                        <div className={style.inputGroup}>
                            <label>Email</label>
                            <input type="email" placeholder="you@example.com" required />
                        </div>

                        <div className={style.inputGroup}>
                            <label>Password</label>
                            <input type="password" placeholder="••••••••" required />
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
