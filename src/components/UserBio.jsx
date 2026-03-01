import { useEffect, useState, useRef } from "react";

function UserBio({ settings, setSettings }) {
    const [bioInfo, setBioInfo] = useState("About me...");
    const [fontFamily, setFontFamily] = useState("Arial");
    const [bgColor, setBgColor] = useState("white");
    const [editing, setEditing] = useState(false); // local edit mode

    const popupRef = useRef(null);

    const fonts = [
        "Arial",
        "Verdana",
        "Tahoma",
        "Times New Roman",
        "Georgia",
        "Courier New",
        "Lucida Console",
    ];

    // Update settings whenever bio text or font changes
    useEffect(() => {
        setSettings(prev => ({
            ...prev,
            userBio: {
                ...prev.userBio,
                bioInfo,
                fontFamily,
                bgColor,
            },
        }));
    }, [bioInfo, fontFamily, bgColor, setSettings]);

    // Load saved settings from DB
    useEffect(() => {
        if (settings?.userBio) {
            setBioInfo(settings.userBio.bioInfo || "About me...");
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
            {/* Bio display: click to edit */}
            <p
                style={{
                    fontFamily,
                    background: bgColor,
                    padding: "0.2rem 0.4rem",
                    borderRadius: "4px",
                    maxWidth: "fit-content",
                    cursor: "pointer",
                }}
                onClick={() => setEditing(true)}
            >
                {bioInfo}
            </p>

            {/* Edit popup */}
            {editing && (
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
                    <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                    />
                    <input
                        style={{ fontFamily, maxWidth: "fit-content" }}
                        value={bioInfo}
                        onChange={(e) => setBioInfo(e.target.value)}
                    />
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

export default UserBio;