import { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./SignupPage.module.css";
import SiteInfoFooter from '../components/SiteInfoFooter';

function SignupPage() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userName, password }),
      });

      // Read error message from backend
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // put generic default settings to make user visual look profile
      const settings = {
        "UserBio": {
          "text": "Type your Bio here...Or turn it off!", "bgColor": "#f8e2af", "padding": 5, "bgColor2": "#d4d4d4", 
          "fontSize": 40, "displayOn": true, "fontColor": "black", "marginTop": 7, "borderSize": 5, "fontFamily": "Arial", 
          "marginLeft": 1, "borderColor": "#ecd6ac", "borderStyle": "ridge", "marginRight": 5, "borderRadius": 5, "marginBottom": 6, 
          "gradientAngle": 135}, 
        "bookCard": {
          "margin": 1, "bgColor": "#9fe8c1", "padding": 10, "bgColor2": "#cfe3b5", "titleSize": 20, "authorSize": 20, 
          "borderSize": 2, "titleColor": "#fc5050", "titleWidth": 100, "authorColor": "#676767", "authorWidth": 100, 
          "borderColor": "#dae7b1", "borderStyle": "solid", "titleMargin": 1, "authorMargin": 1, "borderRadius": 5, "cardImgWidth": 100, 
          "titlePadding": 5, "authorPadding": 5, "gradientAngle": 135, "cardImgBorderSize": 2, "cardImgBorderColor": "#ffffff", 
          "cardImgBorderStyle": "solid", "cardImgBorderRadius": 5}, 
        "mainPage": {"pageBckColor": "#deebad", "gradientAngle": 135, "pageBckColor2": "#38d64d"}, 
        "UserPageTitle": {"text": "Make a page Title", "bgColor": "#ffaaaa", "padding": 5, "bgColor2": "#ff8484", 
          "fontSize": 40, "displayOn": true, "fontColor": "#efefef", "marginTop": 1, "borderSize": 4, "fontFamily": "Arial", 
          "marginLeft": -20, "borderColor": "#b3dfe6", "borderStyle": "solid", "marginRight": 3, "borderRadius": 5, 
          "marginBottom": 12, "gradientAngle": 135}
      }
      try {
        await axios.post(
          "/api/userSettings",
          settings,
          { withCredentials: true }
        );
      } catch (err) {
        console.error(err);
        alert("Failed to Save Default Settings!");
      }

      // success → navigate to login
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.message); // show exact backend error
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
        <SiteInfoFooter />
      </div>
    </div>
  );
}

export default SignupPage;
