import { useState } from "react";
function UserBio({editMode}){
    const [bio,setBio] = useState("About me...");
    return(
        <>
            <p>{bio}</p>
            {editMode && (
                <input onChange={(e) => setBio(e.target.value)}/>
            )}
        </>
    );
}
export default UserBio;