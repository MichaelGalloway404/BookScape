import { useEffect, useState, useRef } from "react";
import EditablePopup from "./EditablePopup"


function UserPageTitle({ editMode, settings, setSettings, titlePlaceHolder }) {
    const [text, setText] = useState(titlePlaceHolder);
    const [fontFamily, setFontFamily] = useState("Arial");
    const [bgColor, setBgColor] = useState("white");
    const [bgColor2, setBgColor2] = useState("white");
    const [fontSize, setFontSize] = useState(40);
    const [borderColor, setBorderColor] = useState("#c4ccd5");
    const [borderSize, setBorderSize] = useState(2);
    const [borderRadius, setBorderRadius] = useState(5);
    const [borderStyle, setBorderStyle] = useState("solid");
    const [padding, setPadding] = useState(5);
    const [marginLeft, setMarginLeft] = useState(1);
    const [marginRight, setMarginRight] = useState(0);
    const [marginTop, setMarginTop] = useState(0);
    const [marginBottom, setMarginBottom] = useState(0);
    const [editing, setEditing] = useState(false);
    const [gradientAngle, setGradientAngle] = useState(135);

    const popupRef = useRef(null);
    const [popupPosition, setPopupPosition] = useState(null);

    // Update settings whenever changes happen
    useEffect(() => {
        setSettings(prev => ({
            ...prev,
            userPageTitle: {
                ...prev.userPageTitle,
                text,
                fontFamily,
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
            },
        }));
    }, [text,
        fontFamily,
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
        setSettings]);

    // Load saved settings from DB
    useEffect(() => {
        if (settings?.userPageTitle) {
            setText(settings.userPageTitle.text);
            setFontFamily(settings.userPageTitle.fontFamily);
            setFontSize(settings.userPageTitle.fontSize);
            setBgColor(settings.userPageTitle.bgColor);
            setBgColor2(settings.userPageTitle.bgColor2);
            setMarginLeft(settings.userPageTitle.marginLeft);
            setMarginRight(settings.userPageTitle.marginRight);
            setMarginTop(settings.userPageTitle.marginTop);
            setMarginBottom(settings.userPageTitle.marginBottom);
            setBorderColor(settings.userPageTitle.borderColor);
            setBorderSize(settings.userPageTitle.borderSize);
            setBorderStyle(settings.userPageTitle.borderStyle);
            setBorderRadius(settings.userPageTitle.borderRadius);
            setPadding(settings.userPageTitle.padding);
            setGradientAngle(settings.userPageTitle.gradientAngle);
        }
    }, [settings]);

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
            <h1
                className={`hoverText ${editMode ? "editable" : ""}`}
                style={{
                    fontFamily,
                    background: `linear-gradient(${gradientAngle}deg, ${bgColor},${bgColor2})`,
                    padding: padding + "px",
                    border: `${borderSize}px ${borderStyle} ${borderColor}`,
                    borderRadius: borderRadius + "px",
                    maxWidth: "fit-content",
                    marginLeft: marginLeft + "px",
                    marginRight: marginRight + "px",
                    marginTop: marginTop + "px",
                    marginBottom: marginBottom + "px",
                    minWidth: editMode ? "50px" : "fit-content",
                    minHeight: editMode ? "50px" : "fit-content",
                    fontSize: fontSize + "px",
                    cursor: editMode ? "pointer" : "default",
                }}
                onClick={(e) => {
                    if (editMode) {
                        setPopupPosition({
                            x: e.clientX,
                            y: e.clientY,
                        });
                        setEditing(true);
                    }
                }}
            >
                {text}
            </h1>

            {/* if in editmode and element has been clicked on */}
            {editing && editMode && (
                <EditablePopup
                    popupRef={popupRef}
                    initialPosition={popupPosition}
                    controls={{
                        "Text": [text, setText],
                        "Background Color 1": [bgColor, setBgColor],
                        "Background Color 2": [bgColor2, setBgColor2],
                        "Font Family": [fontFamily, setFontFamily],
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

export default UserPageTitle;