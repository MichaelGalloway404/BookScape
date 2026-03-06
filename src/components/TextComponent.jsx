import { useEffect, useState, useRef } from "react";
import EditablePopup from "./EditablePopup"

function TextComponent({ editMode, settings, setSettings, ComponentName, defaultText, textMutable }) {
    const [text, setText] = useState(
        settings?.[ComponentName]?.text || defaultText
    );
    const [fontFamily, setFontFamily] = useState(
        settings?.[ComponentName]?.fontFamily || "Arial"
    );
    const [fontColor, setFontColor] = useState(
        settings?.[ComponentName]?.fontColor || "black"
    );
    const [bgColor, setBgColor] = useState(
        settings?.[ComponentName]?.bgColor || "white"
    );
    const [bgColor2, setBgColor2] = useState(
        settings?.[ComponentName]?.bgColor2 || "white"
    );
    const [fontSize, setFontSize] = useState(
        settings?.[ComponentName]?.fontSize || 40
    );
    const [borderColor, setBorderColor] = useState(
        settings?.[ComponentName]?.borderColor || "#c4ccd5"
    );
    const [borderSize, setBorderSize] = useState(
        settings?.[ComponentName]?.borderSize || 2
    );
    const [borderRadius, setBorderRadius] = useState(
        settings?.[ComponentName]?.borderRadius || 5
    );
    const [borderStyle, setBorderStyle] = useState(
        settings?.[ComponentName]?.borderStyle || "solid"
    );
    const [padding, setPadding] = useState(
        settings?.[ComponentName]?.padding || 5
    );
    const [marginLeft, setMarginLeft] = useState(
        settings?.[ComponentName]?.marginLeft || 1
    );
    const [marginRight, setMarginRight] = useState(
        settings?.[ComponentName]?.marginRight || 0
    );
    const [marginTop, setMarginTop] = useState(
        settings?.[ComponentName]?.marginTop || 0
    );
    const [marginBottom, setMarginBottom] = useState(
        settings?.[ComponentName]?.marginBottom || 0
    );
    const [editing, setEditing] = useState(false); 
    const [gradientAngle, setGradientAngle] = useState(
        settings?.[ComponentName]?.gradientAngle || 135
    );
    const [displayOn, setDisplayOn] = useState( 
        settings?.[ComponentName]?.display ?? true
    );

    const popupRef = useRef(null);
    const [popupPosition, setPopupPosition] = useState(null);

    // Update settings whenever changes happen
    useEffect(() => {
        setSettings(prev => ({
            ...prev,
            [ComponentName]: {
                ...prev[ComponentName],
                text,
                fontFamily,
                fontColor,
                fontSize,
                bgColor,
                bgColor2,
                marginLeft,
                marginRight,
                marginTop,
                marginBottom,
                borderColor,
                borderSize,
                borderStyle,
                borderRadius,
                padding,
                gradientAngle,
                displayOn,
            },
        }));
    }, [text,
        fontFamily,
        fontColor,
        bgColor,
        bgColor2,
        marginLeft,
        marginRight,
        marginTop,
        marginBottom,
        fontSize,
        borderColor,
        borderSize,
        borderStyle,
        borderRadius,
        padding,
        gradientAngle,
        displayOn,

        ComponentName,
        setSettings]);

    // Load saved settings from DB
    useEffect(() => {
        if (settings?.[ComponentName]) {
            setText(settings[ComponentName].text);
            setFontFamily(settings[ComponentName].fontFamily);
            setFontColor(settings[ComponentName].fontColor);
            setFontSize(settings[ComponentName].fontSize);
            setBgColor(settings[ComponentName].bgColor);
            setBgColor2(settings[ComponentName].bgColor2);
            setBorderColor(settings[ComponentName].borderColor);
            setBorderSize(settings[ComponentName].borderSize);
            setBorderStyle(settings[ComponentName].borderStyle);
            setBorderRadius(settings[ComponentName].borderRadius);
            setMarginLeft(settings[ComponentName].marginLeft);
            setMarginRight(settings[ComponentName].marginRight);
            setMarginTop(settings[ComponentName].marginTop);
            setMarginBottom(settings[ComponentName].marginBottom);
            setPadding(settings[ComponentName].padding);
            setGradientAngle(settings[ComponentName].gradientAngle);
            setDisplayOn(settings[ComponentName].displayOn);
        }
    }, [settings, ComponentName]);

    // Close popup if click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setEditing(false);
            }
        }

        if (editing) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editing]);

    return (
        <>
            {/* Bio display */}
            <p
                className={`hoverText ${editMode ? "editable" : ""}`}
                style={{
                    display: (displayOn || editMode) ? "flex" : "none",
                    fontFamily,
                    color: fontColor,
                    background: `linear-gradient(${gradientAngle}deg, ${bgColor},${bgColor2})`,
                    padding: padding + "px",
                    border: `${borderSize}px ${borderStyle} ${borderColor}`,
                    borderRadius: borderRadius + "px",
                    maxWidth: "fit-content",
                    marginLeft: marginLeft + "px",
                    marginRight: marginRight + "px",
                    marginTop: marginTop + "px",
                    marginBottom: marginBottom + "px",
                    minWidth: editMode ? "10px" : "fit-content",
                    minHeight: editMode ? "10px" : "fit-content",
                    fontSize: fontSize + "px",
                    cursor: editMode ? "pointer" : "default",
                }}
                onClick={(e) => {
                    if (editMode) {
                        setPopupPosition({
                            x: e.pageX,
                            y: e.pageY,
                        });
                        setEditing(true);
                    }
                }}
            >
                {text}
            </p>

            {/* if in editmode and element has been clicked on */}
            {editing && editMode && (
                <EditablePopup
                    popupRef={popupRef}
                    initialPosition={popupPosition}
                    controls={{
                        // "Text": [text, setText], 
                        ...(textMutable && { "Text": [text, setText] }),
                        "Hide This element? Will still show in edit mode.": [displayOn, setDisplayOn],
                        "Background Color 1": [bgColor, setBgColor],
                        "Background Color 2": [bgColor2, setBgColor2],
                        "Font Family": [fontFamily, setFontFamily],
                        "Font Color": [fontColor, setFontColor],
                        "Font Size": [Number(fontSize), setFontSize],
                        "Offset From Left": [Number(marginLeft), setMarginLeft],
                        "Offset From Right": [Number(marginRight), setMarginRight],
                        "Offset From Top": [Number(marginTop), setMarginTop],
                        "Offset From Bottom": [Number(marginBottom), setMarginBottom],
                        "Border Color": [borderColor, setBorderColor],
                        "Border Size": [Number(borderSize), setBorderSize],
                        "Border Style": [borderStyle, setBorderStyle],
                        "Border Radius": [Number(borderRadius), setBorderRadius],
                        "Padding": [Number(padding), setPadding],
                        "Gradient Angle": [Number(gradientAngle), setGradientAngle],
                    }}
                />
            )}
        </>
    );
}
export default TextComponent;