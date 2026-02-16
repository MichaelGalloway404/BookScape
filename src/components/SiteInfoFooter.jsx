import style from './SiteInfoFooter.module.css'
import { useNavigate } from "react-router-dom";

function SiteInfoFooter(props) {
  const today = new Date();
  const day = today.toLocaleDateString("en-US", { weekday: "long" });
  const date = today.getDate();
  const year = today.getFullYear();
  const navigate = useNavigate();

  return (
    <>
      <button className={style.homeBtn} onClick={() => navigate("/")}> Return Home </button>
      {/*testing common prop usage  */}
      <p className={style.footerInfo}>Today is: {day} the {date}, {year}</p>
    </>
  );
}

export default SiteInfoFooter;
