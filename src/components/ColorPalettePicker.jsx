import { useState } from "react";
import styles from "./ColorPalettePicker.module.css";

function ColorPalettePicker() {
  const [bgColor, setBgColor] = useState("#ffffff");

  return (
    <div
      className={styles.container}
      style={{ "--bg-color": bgColor }}
    >
      <h2>Choose any color</h2>

      <input
        type="color"
        value={bgColor}
        onChange={(e) => setBgColor(e.target.value)}
        className={styles.colorInput}
      />
    </div>
  );
}

export default ColorPalettePicker;
