import { useEffect, useState } from "react";

function UserBio({ editMode, settings, setSettings, setEditMode }) {
    const [bioInfo, setBioInfo] = useState("About me...");
    const [fontFamily, setFontFamily] = useState("Arial");
    const [bgColor, setBgColor] = useState("white");

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
    }, [bioInfo, fontFamily, setSettings, bgColor]);

    // Load saved settings from DB
    useEffect(() => {
        if (settings?.userBio) {
            setBioInfo(settings.userBio.bioInfo || "About me...");
            setFontFamily(settings.userBio.fontFamily || "Arial");
            setBgColor(settings.userBio.bgColor || "white");
        }
    }, [settings]);

    return (
        <>
            {editMode && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                    }}
                    onClick={() => setEditMode(false)} // close when clicking outside
                >
                    <div
                        style={{
                            background: "white",
                            padding: "1rem",
                            borderRadius: "8px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                            minWidth: "300px",
                        }}
                        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                    >
                        <h3>Edit Bio</h3>
                        <input
                            type="color"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                        />
                        <input
                            style={{ fontFamily }}
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
                        <button onClick={() => setEditMode(false)}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default UserBio;