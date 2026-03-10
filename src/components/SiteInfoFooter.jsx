import styles from './SiteInfoFooter.module.css'
import { useNavigate } from "react-router-dom";

function SiteInfoFooter(props) {
  const navigate = useNavigate();

  return (
    <>
      <button className={`${styles.buttonClass} ${styles.homeBtn}`} onClick={() => navigate("/")}> Return Home </button>
    </>
  );
}

export default SiteInfoFooter;
