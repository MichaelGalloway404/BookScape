import { useEffect, useState } from "react";
function UserBio({ editMode, settings, setSettings }) {
    const [bioInfo, setBioInfo] = useState("About me...");

    // add any changes to settings the user makes
    useEffect(() => {
        setSettings(prev => ({
            ...prev,
            userBio: {
                ...prev.userBio,
                bioInfo,
            },
        }));
    }, [bioInfo, setSettings]);

    // Check for DataBase saved settings
    useEffect(() => {
        if (settings?.userBio) {
            setBioInfo(settings.userBio.bgColor);
        }
    }, [settings]);

    return (
        <>
            {!editMode && (
                <p>{bioInfo}</p>
            )}
            {editMode && (
                <input
                    value={bioInfo}
                    onChange={(e) => setBioInfo(e.target.value)}
                />
            )}
        </>
    );
}
export default UserBio;