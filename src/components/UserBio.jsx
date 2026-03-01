import { useState } from "react";
function UserBio({editMode}){
    const [bio,setBio] = useState("About me...");
    return(
        <>
            {!editMode && (
                <p>{bio}</p>
            )}
            {editMode && (
                <input 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
            )}
        </>
    );
}
export default UserBio;