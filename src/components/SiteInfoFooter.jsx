import '../styles/index.css'

function SiteInfoFooter(props) {
  let className = props.primary ? 'primary' : '';
  const today = new Date();
  const day = today.toLocaleDateString("en-US", { weekday: "long" });
  const date = today.getDate();
  const year = today.getFullYear();

  return (
    <div>
      {/*testing common prop usage  */}
      <p className={className}>
        This is a website
      </p>
      <p className={`${className} font-xl`}>
        Books are Great.
      </p>
      <p className={className}>Today is: {day} the {date}, {year}</p>
    </div>
  );
}

export default SiteInfoFooter;
