import { useState } from "react";
import styles from "./BackgroundColorPicker.module.css";

function BackgroundColorPicker() {
    const [bgColor, setBgColor] = useState("white");

    return (
        <div
            className={styles.container}
            // give user the ability to change the components color
            style={{ backgroundColor: bgColor }}
        >
            <label className={styles.label}>
                Choose background color:
            </label>

            {/* select a preset color */}
            <select
                className={styles.select}
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
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
