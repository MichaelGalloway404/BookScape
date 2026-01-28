import { useState } from "react";

function BackgroundColorPicker() {
  const [bgColor, setBgColor] = useState("white");

  return (
    <div
      style={{
        backgroundColor: bgColor,
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        transition: "background-color 0.3s ease"
      }}
    >
      <label style={{ fontSize: "18px", marginRight: "10px" }}>
        Choose background color:
      </label>

      <select
        value={bgColor}
        onChange={(e) => setBgColor(e.target.value)}
        style={{ fontSize: "16px", padding: "5px" }}
      >
        <option value="white">White</option>
        <option value="lightblue">Light Blue</option>
        <option value="lightgreen">Light Green</option>
        <option value="lightgray">Light Gray</option>
        <option value="lavender">Lavender</option>
      </select>
    </div>
  );
}

export default BackgroundColorPicker;
