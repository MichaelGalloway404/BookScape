import { useEffect, useState, useRef } from "react";
import EditablePopup from "./EditablePopup"

function TextElement({
  saveName,
  textToDisplay,
  editMode,
  settings,
  setSettings
}) {
  const [editing, setEditing] = useState(false);
  const [bgColor, setBgColor] = useState("#c4ccd5");

  const popupRef = useRef(null);

  // add any changes to settings the user makes
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      [saveName]: {
        ...prev[saveName],
        bgColor,
      },
    }));
  }, [bgColor,
      setSettings]);

  // Check for DataBase saved settings
  useEffect(() => {
    if (settings?.[saveName]) {
      setBgColor(settings[saveName].bgColor);
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
      {/* if in editmode and element has been clicked on */}
      {editing && editMode && (
        <EditablePopup
          popupRef={popupRef}
          controls={{
            bgColor: [bgColor, setBgColor],
          }}
        />
      )}
    <p 
        onClick={() => { if (editMode) setEditing(true); }}>
            {textToDisplay} 
    </p>
    </>
  );
}

export default TextElement;