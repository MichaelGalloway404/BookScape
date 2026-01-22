import '../styles/index.css'

function SiteInfoFooter(props) {
  let className = props.primary ? 'primary' : '';
  return (
    <div>
       {/*testing common prop usage  */}
      <h1 className={className}>This is my website</h1>
      <h2 className={`${className} font-xl`}>Books are an entry way that only the individual can experiance,
         though the ground may have been traversed by another just as life the experiance is yours.
      </h2>
      <ul>
        <li>
          <p>test for inheritance of styles</p>
        </li>
        <li>
          <p>test for inheritance of styles</p>
        </li>
        <li>
          <p>test for inheritance of styles</p>
        </li>
      </ul>
    </div>
  );
}

export default SiteInfoFooter;
