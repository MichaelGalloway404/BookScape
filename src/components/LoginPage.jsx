import { useNavigate } from "react-router-dom";
import { useState } from "react";
import style from './LoginPage.module.css'

function LoginPage() {

    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    let showInfo = false;

    const showUserInfo = () =>{
        showInfo =true;
        // alert(password);
        // alert(userName);
    }

    return (
        <>
            <div className={style.loginContainer}>
                <div className={style.loginCard}>
                    <h1>Welcome Back</h1>
                    <p>Please sign in to your account</p>
                    
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
                        <button className={style.loginButton} onClick={showUserInfo} type="submit">Sign In</button>
                    </form>
                    {showInfo ? <h2>user name: {userName}</h2> : <h2>user name:</h2>}
                    {showInfo ? <h2>password: {password}</h2> : <h2>password: </h2>}
                    
                    

                    <div className={style.footerText}>
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
