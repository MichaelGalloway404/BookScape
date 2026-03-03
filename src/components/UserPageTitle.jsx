import { useEffect, useState, useRef } from "react";
import EditablePopup from "./EditablePopup"


function UserPageTitle({ editMode, settings, setSettings, titlePlaceHolder }) {
    const [text, setText] = useState(titlePlaceHolder);
    const [fontFamily, setFontFamily] = useState("Arial");
    const [bgColor, setBgColor] = useState("white");
    const [bgColor2, setBgColor2] = useState("white");
    const [fontSize, setFontSize] = useState(40);
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
                bgColor,
                bgColor2,
                marginLeft,
            },
        }));
    }, [text, fontFamily, bgColor, bgColor2, marginLeft, setSettings]);

    // Load saved settings from DB
    useEffect(() => {
        if (settings?.userPageTitle) {
            setText(settings.userPageTitle.text);
            setFontFamily(settings.userPageTitle.fontFamily);
            setBgColor(settings.userPageTitle.bgColor);
            setBgColor2(settings.userPageTitle.bgColor2);
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
                    padding: "0.2rem 0.4rem",
                    borderRadius: "4px",
                    maxWidth: "fit-content",
                    marginLeft: marginLeft + "px",
                    minWidth: editMode ? "200px" : "fit-content",
                    minHeight: editMode ? "200px" : "fit-content",
                    fontSize: fontSize + "px",
                    cursor: editMode ? "pointer" : "default",
                }}
                onClick={() => { if (editMode) setEditing(true); }}
            >
                {text}
            </h1>

            {/* Edit popup */}
            {editing && editMode && (
                <EditablePopup
                    popupRef={popupRef}
                    controls={{
                        text: [text, setText],
                        bgColor: [bgColor, setBgColor],
                        bgColor2: [bgColor2, setBgColor2],
                        fontFamily: [fontFamily, setFontFamily],
                        fontSize: [fontSize, setFontSize],
                        marginLeft: [marginLeft, setMarginLeft],
                    }}
                />
            )}
        </>
    );
}

export default UserPageTitle;