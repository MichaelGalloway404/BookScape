import { useEffect, useState, useRef } from "react";
import EditablePopup from "./EditablePopup"

function UserBio({ editMode, settings, setSettings }) {
    const [text, setText] = useState("About me...");
    const [fontFamily, setFontFamily] = useState("Arial");
    const [bgColor, setBgColor] = useState("white");
    const [bgColor2, setBgColor2] = useState("white");
    const [fontSize, setFontSize] = useState(40);
    const [marginLeft, setMarginLeft] = useState(1);
    const [editing, setEditing] = useState(false);

    const popupRef = useRef(null);

    // Update settings whenever bio text or font changes
    useEffect(() => {
        setSettings(prev => ({
            ...prev,
            userBio: {
                ...prev.userBio,
                text,
                fontFamily,
                fontSize,
                bgColor,
                bgColor2,
                marginLeft,
            },
        }));
    }, [text, fontFamily, bgColor, bgColor2, marginLeft, fontSize, setSettings]);

    // Load saved settings from DB
    useEffect(() => {
        if (settings?.userBio) {
            setText(settings.userBio.text);
            setFontFamily(settings.userBio.fontFamily);
            setFontSize(settings.userBio.fontSize);
            setBgColor(settings.userBio.bgColor);
            setBgColor2(settings.userBio.bgColor2);
            setMarginLeft(settings.userBio.marginLeft);
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
            <p
                style={{
                    fontFamily,
                    background: `linear-gradient(135deg, ${bgColor},${bgColor2})`,
                    padding: "0.2rem 0.4rem",
                    borderRadius: "4px",
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
            </p>

            {/* if in editmode and element has been clicked on */}
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

export default UserBio;