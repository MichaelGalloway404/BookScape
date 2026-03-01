import { useEffect, useState } from "react";

function UserBio({ editMode, settings, setSettings }) {
    const [bioInfo, setBioInfo] = useState("About me...");
    const [fontFamily, setFontFamily] = useState("Arial"); // default font

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
            },
        }));
    }, [bioInfo, fontFamily, setSettings]);

    // Load saved settings from DB
    useEffect(() => {
        if (settings?.userBio) {
            setBioInfo(settings.userBio.bioInfo || "About me...");
            setFontFamily(settings.userBio.fontFamily || "Arial");
        }
    }, [settings]);

    return (
        <>
            {!editMode && (
                <p style={{ fontFamily }}>{bioInfo}</p>
            )}
            {editMode && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
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
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </select>
                    </label>
                </div>
            )}
        </>
    );
}

export default UserBio;