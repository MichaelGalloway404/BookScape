import React from "react";
import '../styles/index.css'

function Test(props) {
  let className = props.primary ? 'primary' : '';
  return (
    <div>
      <h1 className={className}>Hello</h1>
      <h2 className={`${className} font-xl`}>Hello2</h2>
    </div>
  );
}

export default Test;
