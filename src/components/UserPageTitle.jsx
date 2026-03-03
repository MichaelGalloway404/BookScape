import { useEffect, useState, useRef } from "react";
import EditablePopup from "./EditablePopup"


function UserPageTitle({ editMode, settings, setSettings, titlePlaceHolder }) {
    const [text, setText] = useState(titlePlaceHolder);
    const [fontFamily, setFontFamily] = useState("Arial");
    const [bgColor, setBgColor] = useState("white");
    const [bgColor2, setBgColor2] = useState("white");
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
                bgColor2,
            },
        }));
    }, [text, fontFamily, bgColor, bgColor2, setSettings]);

    // Load saved settings from DB
    useEffect(() => {
        if (settings?.userPageTitle) {
            setText(settings.userPageTitle.text);
            setFontFamily(settings.userPageTitle.fontFamily || "Arial");
            setBgColor(settings.userPageTitle.bgColor || "white");
            setBgColor2(settings.userPageTitle.bgColor2 || "white");
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
                    minWidth: editMode ? "200px" : "fit-content",
                    minHeight: editMode ? "200px" : "fit-content",
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
                        bgColor2: true,
                        text: true,
                        fontFamily: true,
                        fontSize: true,
                    }}
                    values={{
                        fontFamily,
                        fontSize,
                        bgColor,
                        bgColor2,
                        text,
                    }}
                    setters={{
                        setFontFamily,
                        setFontSize,
                        setBgColor,
                        setBgColor2,
                        setText
                    }}
                />
            )}
        </>
    );
}

export default UserPageTitle;