import { useState } from "react";
import styles from "./ColorPalettePicker.module.css";

const COLORS = [
  "#ffffff",
  "#f8b4b4",
  "#fde68a",
  "#bbf7d0",
  "#bfdbfe",
  "#e9d5ff"
];

function ColorPalettePicker() {
  const [bgColor, setBgColor] = useState(COLORS[0]);

  return (
    <div
      className={styles.container}
      style={{ "--bg-color": bgColor }}
    >
      <h2 className={styles.title}>Choose a background color</h2>

      <div className={styles.palette}>
        {COLORS.map((color) => (
          <button
            key={color}
            className={styles.swatch}
            style={{ backgroundColor: color }}
            onClick={() => setBgColor(color)}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </div>
  );
}

export default ColorPalettePicker;
