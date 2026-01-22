import style from './SiteInfoFooter.module.css'

function SiteInfoFooter(props) {
  const today = new Date();
  const day = today.toLocaleDateString("en-US", { weekday: "long" });
  const date = today.getDate();
  const year = today.getFullYear();

  return (
    <div>
      {/*testing common prop usage  */}
      <p className={style.footerInfo}>
        This is a website
      </p>
      <p className={`${style.footerInfo}, ${style.fontXl}`}>
        Books are Great.
      </p>
      <p className={footerInfo}>Today is: {day} the {date}, {year}</p>
    </div>
  );
}

export default SiteInfoFooter;
