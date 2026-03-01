import { useEffect, useState } from "react";

function UserBio({ editMode, settings, setSettings }) {
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
            {!editMode && (
                <p style={{
                    fontFamily,
                    background: bgColor,
                    maxWidth: "fit-content"
                }}>{bioInfo}</p>
            )}
            {editMode && (
                <>
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
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </select>
                    </label>
                </>
            )}
        </>
    );
}

export default UserBio;