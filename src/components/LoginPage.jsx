import { useNavigate } from "react-router-dom";
import style from './LoginPage.module.css'

function LoginPage() {
    
    const navigate = useNavigate();

    return (
        <>
            <div className={style.login - container}>
                <div className={style.login - card}>
                    <h1>Welcome Back</h1>
                    <p>Please sign in to your account</p>

                    <form>
                        <div className={style.input - group}>
                            <label>Email</label>
                            <input type="email" placeholder="you@example.com" required />
                        </div>

                        <div className={style.input - group}>
                            <label>Password</label>
                            <input type="password" placeholder="••••••••" required />
                        </div>

                        <button className={style.loginButton} type="submit">Sign In</button>
                    </form>

                    <div className={style.footer - text}>
                        <a href="#">Forgot password?</a>
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
