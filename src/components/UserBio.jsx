import { useEffect, useState, useRef } from "react";
import fonts from "../styles/fonts"
import EditablePopup from "./EditablePopup"

function UserBio({ editMode, settings, setSettings }) {
    const [text, setText] = useState("About me...");
    const [fontFamily, setFontFamily] = useState("Arial");
    const [bgColor, setBgColor] = useState("white");
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
            },
        }));
    }, [text, fontFamily, bgColor, setSettings]);

    // Load saved settings from DB
    useEffect(() => {
        if (settings?.userBio) {
            setText(settings.userBio.text || "About me...");
            setFontFamily(settings.userBio.fontFamily || "Arial");
            setBgColor(settings.userBio.bgColor || "white");
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
                    background: bgColor,
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
                    setEditing={setEditing}
                    popupRef={popupRef}
                    fonts={fonts}
                    features={{
                        bgColor: true,
                        text: true,
                        fontFamily: true,
                        fontSize: false,
                    }}
                    values={{
                        fontFamily,
                        bgColor,
                        text,
                    }}
                    setters={{
                        setFontFamily,
                        setBgColor,
                        setText
                    }}
                />
            )}
        </>
    );
}

export default UserBio;