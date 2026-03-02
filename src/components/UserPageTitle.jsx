import { useEffect, useState, useRef } from "react";
import EditablePopup from "./EditablePopup"


function UserPageTitle({ editMode, settings, setSettings, titlePlaceHolder }) {
    const [text, setText] = useState(titlePlaceHolder);
    const [fontFamily, setFontFamily] = useState("Arial");
    const [bgColor, setBgColor] = useState("white");
    const [fontSize, setFontSize] = useState(40);
    const [editing, setEditing] = useState(false);

    const popupRef = useRef(null);

    // Update settings whenever bio text or font changes
    useEffect(() => {
        setSettings(prev => ({
            ...prev,
            userPageTitle: {
                ...prev.userPageTitle,
                text,
                fontFamily,
                bgColor,
            },
        }));
    }, [text, fontFamily, bgColor, setSettings]);

    // Load saved settings from DB
    useEffect(() => {
        if (settings?.userPageTitle) {
            setText(settings.userPageTitle.text);
            setFontFamily(settings.userPageTitle.fontFamily);
            setBgColor(settings.userPageTitle.bgColor);
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
                className={editMode ? "hover:shadow-lg transition-shadow duration-200" : ""}
                style={{
                    fontFamily,
                    background: bgColor,
                    padding: "0.2rem 0.4rem",
                    borderRadius: "4px",
                    maxWidth: "fit-content",
                    fontSize: fontSize+"px",
                    cursor: editMode ? "pointer" : "default",
                }}
                onClick={() => { if (editMode) setEditing(true); }}
            >
                {text}
            </h1>

            {/* Edit popup */}
            {editing && editMode && (
                <EditablePopup
                    setEditing={setEditing}
                    popupRef={popupRef}
                    features={{
                        bgColor: true,
                        text: true,
                        fontFamily: true,
                        fontSize: true,
                    }}
                    values={{
                        fontFamily,
                        fontSize,
                        bgColor,
                        text,
                    }}
                    setters={{
                        setFontFamily,
                        setFontSize,
                        setBgColor,
                        setText
                    }}
                />
            )}
        </>
    );
}

export default UserPageTitle;