import { useEffect, useState, useRef } from "react";
import EditablePopup from "./EditablePopup"


function UserPageTitle({ editMode, settings, setSettings, titlePlaceHolder }) {
    const [text, setText] = useState(titlePlaceHolder);
    const [fontFamily, setFontFamily] = useState("Arial");
    const [bgColor, setBgColor] = useState("white");
    const [bgColor2, setBgColor2] = useState("white");
    const [fontSize, setFontSize] = useState(40);
    const [borderRadius, setBorderRadius] = useState(5);
    const [padding, setPadding] = useState(5);
    const [marginLeft, setMarginLeft] = useState(1);
    const [editing, setEditing] = useState(false);

    const popupRef = useRef(null);

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
                borderRadius,
                padding,
                padding,
            },
        }));
    }, [text,
        fontFamily,
        bgColor,
        bgColor2,
        marginLeft,
        fontSize,
        borderRadius,
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
            setBorderRadius(settings.userPageTitle.borderRadius);
            setPadding(settings.userPageTitle.padding);
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
                    background: `linear-gradient(135deg, ${bgColor},${bgColor2})`,
                    padding: padding + "px",
                    borderRadius: borderRadius + "px",
                    maxWidth: "fit-content",
                    marginLeft: marginLeft + "px",
                    minWidth: editMode ? "200px" : "fit-content",
                    minHeight: editMode ? "100px" : "fit-content",
                    fontSize: fontSize + "px",
                    cursor: editMode ? "pointer" : "default",
                }}
                onClick={() => { if (editMode) setEditing(true); }}
            >
                {text}
            </h1>

            {/* if in editmode and element has been clicked on */}
            {editing && editMode && (
                <EditablePopup
                    popupRef={popupRef}
                    controls={{
                        text: [text, setText],
                        bgColor: [bgColor, setBgColor],
                        bgColor2: [bgColor2, setBgColor2],
                        fontFamily: [fontFamily, setFontFamily],
                        fontSize: [Number(fontSize), setFontSize],
                        marginLeft: [Number(marginLeft), setMarginLeft],
                        borderRadius: [Number(borderRadius),setBorderRadius],
                        padding: [Number(padding),setPadding],
                    }}
                />
            )}
        </>
    );
}

export default UserPageTitle;