import { useEffect, useState, useRef } from "react";
import EditablePopup from "./EditablePopup"

function UserBio({ editMode, settings, setSettings }) {
    const [text, setText] = useState("About me...");
    const [fontFamily, setFontFamily] = useState("Arial");
    const [bgColor, setBgColor] = useState("white");
    const [bgColor2, setBgColor2] = useState("white");
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
                bgColor,
                bgColor2,
            },
        }));
    }, [text, fontFamily, bgColor, bgColor2, setSettings]);

    // Load saved settings from DB
    useEffect(() => {
        if (settings?.userBio) {
            setText(settings.userBio.text);
            setFontFamily(settings.userBio.fontFamily);
            setBgColor(settings.userBio.bgColor);
            setBgColor2(settings.userBio.bgColor2);
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
                    cursor: editMode ? "pointer" : "default",
                }}
                onClick={() => { if (editMode) setEditing(true); }}
            >
                {text}
            </p>

            {/* Edit popup */}
            {editing && editMode && (
                <EditablePopup
                    popupRef={popupRef}
                    controls={{
                        text: [text, setText],
                        bgColor: [bgColor, setBgColor],
                        bgColor2: [bgColor2, setBgColor2],
                        fontFamily: [fontFamily, setFontFamily],
                    }}
                />
            )}
        </>
    );
}

export default UserBio;