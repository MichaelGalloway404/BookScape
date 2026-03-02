import { useEffect, useState, useRef } from "react";
import fonts from "../styles/fonts"

function UserPageTitle({ editMode, settings, setSettings, titlePlaceHolder }) {
    const [titleText, setTitleText] = useState(titlePlaceHolder);
    const [fontFamily, setFontFamily] = useState("Arial");
    const [bgColor, setBgColor] = useState("white");
    const [editing, setEditing] = useState(false);

    const popupRef = useRef(null);

    // Update settings whenever bio text or font changes
    useEffect(() => {
        setSettings(prev => ({
            ...prev,
            userPageTitle: {
                ...prev.userPageTitle,
                titleText,
                fontFamily,
                bgColor,
            },
        }));
    }, [titleText, fontFamily, bgColor, setSettings]);

    // Load saved settings from DB
    useEffect(() => {
        if (settings?.userPageTitle) {
            setTitleText(settings.userPageTitle.titleText);
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
                {titleText}
            </h1>

            {/* Edit popup */}
            {editing && editMode && (
                <div
                    ref={popupRef}
                    style={{
                        position: "absolute",
                        background: "white",
                        padding: "1rem",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        zIndex: 1000,
                    }}
                >
                    {/* BACKGROUNND COLOR OF BIO */}
                    <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                    />
                    {/* FONT FAMILY */}
                    <input
                        style={{ fontFamily, maxWidth: "fit-content" }}
                        value={titleText}
                        onChange={(e) => setTitleText(e.target.value)}
                    />
                    {/* FONT CHOICE */}
                    <label>
                        Choose font:
                        <select
                            value={fontFamily}
                            onChange={(e) => setFontFamily(e.target.value)}
                        >
                            {fonts.map((f) => (
                                <option key={f} value={f}>
                                    {f}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            )}
        </>
    );
}

export default UserPageTitle;