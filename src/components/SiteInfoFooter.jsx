import style from './SiteInfoFooter.module.css'

function SiteInfoFooter(props) {
  const today = new Date();
  const day = today.toLocaleDateString("en-US", { weekday: "long" });
  const date = today.getDate();
  const year = today.getFullYear();

  return (
    <>
      {/*testing common prop usage  */}
      <p className={style.footerInfo}>Today is: {day} the {date}, {year}</p>
    </>
  );
}

export default SiteInfoFooter;
