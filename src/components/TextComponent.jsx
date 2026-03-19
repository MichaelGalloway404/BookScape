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
        settings?.[ComponentName]?.displayOn ?? true
    );
    // const [text, setText] = useState(defaultText);
    // const [fontFamily, setFontFamily] = useState("Arial");
    // const [fontColor, setFontColor] = useState("black");
    // const [bgColor, setBgColor] = useState("white");
    // const [bgColor2, setBgColor2] = useState("white");
    // const [fontSize, setFontSize] = useState(40);
    // const [borderColor, setBorderColor] = useState("#c4ccd5");
    // const [borderSize, setBorderSize] = useState(2);
    // const [borderRadius, setBorderRadius] = useState(5);
    // const [borderStyle, setBorderStyle] = useState("solid");
    // const [padding, setPadding] = useState(5);
    // const [marginLeft, setMarginLeft] = useState(1);
    // const [marginRight, setMarginRight] = useState(0);
    // const [marginTop, setMarginTop] = useState(0);
    // const [marginBottom, setMarginBottom] = useState(0);
    // const [gradientAngle, setGradientAngle] = useState(135);
    // const [displayOn, setDisplayOn] = useState(true);
    const [backgroundColorOn, setBackgroundColorOn] = useState(true);

    const popupRef = useRef(null);

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
                backgroundColorOn,
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
        backgroundColorOn,

        ComponentName,
        setSettings]);

    // Load saved settings from DB
    // useEffect(() => {
    //     if (settings?.[ComponentName]) {
    //         setText(settings[ComponentName].text);
    //         setFontFamily(settings[ComponentName].fontFamily);
    //         setFontColor(settings[ComponentName].fontColor);
    //         setFontSize(settings[ComponentName].fontSize);
    //         setBgColor(settings[ComponentName].bgColor);
    //         setBgColor2(settings[ComponentName].bgColor2);
    //         setBorderColor(settings[ComponentName].borderColor);
    //         setBorderSize(settings[ComponentName].borderSize);
    //         setBorderStyle(settings[ComponentName].borderStyle);
    //         setBorderRadius(settings[ComponentName].borderRadius);
    //         setMarginLeft(settings[ComponentName].marginLeft);
    //         setMarginRight(settings[ComponentName].marginRight);
    //         setMarginTop(settings[ComponentName].marginTop);
    //         setMarginBottom(settings[ComponentName].marginBottom);
    //         setPadding(settings[ComponentName].padding);
    //         setGradientAngle(settings[ComponentName].gradientAngle);
    //         setDisplayOn(settings[ComponentName].displayOn ?? true);
    //     }
    // }, [settings, ComponentName]);
    useEffect(() => {
        if (settings?.[ComponentName]) {
            const s = settings[ComponentName];

            if (s.text !== undefined) setText(s.text);
            if (s.fontFamily) setFontFamily(s.fontFamily);
            if (s.fontColor) setFontColor(s.fontColor);
            if (s.fontSize) setFontSize(s.fontSize);
            if (s.bgColor) setBgColor(s.bgColor);
            if (s.bgColor2) setBgColor2(s.bgColor2);
            if (s.borderColor) setBorderColor(s.borderColor);
            if (s.borderSize) setBorderSize(s.borderSize);
            if (s.borderStyle) setBorderStyle(s.borderStyle);
            if (s.borderRadius) setBorderRadius(s.borderRadius);
            if (s.marginLeft) setMarginLeft(s.marginLeft);
            if (s.marginRight) setMarginRight(s.marginRight);
            if (s.marginTop) setMarginTop(s.marginTop);
            if (s.marginBottom) setMarginBottom(s.marginBottom);
            if (s.padding) setPadding(s.padding);
            if (s.gradientAngle) setGradientAngle(s.gradientAngle);
            if (s.backgroundColorOn) setBackgroundColorOn(s.backgroundColorOn);

            // boolean fix
            if (s.displayOn !== undefined) setDisplayOn(s.displayOn);
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
                    background: (backgroundColorOn ? `linear-gradient(${gradientAngle}deg, ${bgColor},${bgColor2})` : "none"),
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
                    controls={{
                        // "Text": [text, setText], 
                        ...(textMutable && { "Text": [text, setText] }),
                        "Hide This element? Will still show in edit mode.": [displayOn, setDisplayOn],
                        "Background ON/OFF": [backgroundColorOn, setBackgroundColorOn],
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