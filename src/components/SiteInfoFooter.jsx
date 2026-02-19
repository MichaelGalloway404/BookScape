import styles from './SiteInfoFooter.module.css'
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function SiteInfoFooter(props) {
  const today = new Date();
  const day = today.toLocaleDateString("en-US", { weekday: "long" });
  const date = today.getDate();
  const year = today.getFullYear();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.background = "linear-gradient(135deg, #0f2027, #203a43, #2c5364)";
  }, []);

  return (
    <>
      <button className={`${styles.buttonClass} ${styles.homeBtn}`} onClick={() => navigate("/")}> Return Home </button>
      {/*testing common prop usage  */}
      <p className={styles.footerInfo}>Today is: {day} the {date}, {year}</p>
    </>
  );
}

export default SiteInfoFooter;
