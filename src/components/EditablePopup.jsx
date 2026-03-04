import { useState, useRef, useEffect } from "react";
import fonts from "../styles/fonts";
import borderTypes from "../styles/borderTypes";

function EditablePopup({ popupRef, controls = {} }) {

    // Stores popup position
    const [position, setPosition] = useState({ x: 200, y: 200 });

    // Tracks dragging state
    const isDragging = useRef(false);

    // Stores mouse offset inside popup when drag starts
    const dragOffset = useRef({ x: 0, y: 0 });


    // Handle mouse move (global so drag feels smooth)
    useEffect(() => {
        function handleMouseMove(e) {
            if (!isDragging.current) return;

            setPosition({
                x: e.clientX - dragOffset.current.x,
                y: e.clientY - dragOffset.current.y,
            });
        }

        function handleMouseUp() {
            isDragging.current = false;
        }

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);


    // Start dragging
    function handleMouseDown(e) {
        isDragging.current = true;

        // Calculate where inside popup user clicked
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
    }


    return (
        <div
            ref={popupRef}
            style={{
                position: "absolute",
                top: position.y,
                left: position.x,
                background: "white",
                padding: "1rem",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                zIndex: 1000,
                minWidth: "200px",
                // limit height
                maxHeight: "300px",
                // croll when too tall     
                overflowY: "auto",     
            }}
        >

            {/* Drag Handle Header */}
            <div
                onMouseDown={handleMouseDown}
                style={{
                    cursor: "grab",
                    fontWeight: "bold",
                    paddingBottom: "0.5rem",
                    borderBottom: "1px solid #ddd",
                    marginBottom: "0.5rem",
                }}
            >
                Drag Me
            </div>


            {Object.entries(controls).map(([key, [value, setter]]) => {

                // COLOR PICKER
                if (key.toLowerCase().includes("color")) {
                    return (
                        <label key={key}>
                            {key}
                            <input
                                style={{marginLeft: "5px"}}
                                type="color"
                                value={value}
                                onChange={(e) => setter(e.target.value)}
                            />
                        </label>
                    );
                }

                // FONT PICKER
                if (key === "fontFamily") {
                    return (
                        <label key={key}>
                            Choose font:
                            <select
                                style={{marginLeft: "5px"}}
                                value={value}
                                onChange={(e) =>
                                    setter(e.target.value)
                                }
                            >
                                {fonts.map((f) => (
                                    <option key={f} value={f}>
                                        {f}
                                    </option>
                                ))}
                            </select>
                        </label>
                    );
                }

                // BORDER STYLE PICKER
                if (key.toLowerCase().includes("style")) {
                    return (
                        <label key={key}>
                            Choose Border Style:
                            <select
                                style={{marginLeft: "5px"}}
                                value={value}
                                onChange={(e) =>
                                    setter(e.target.value)
                                }
                            >
                                {borderTypes.map((f) => (
                                    <option key={f} value={f}>
                                        {f}
                                    </option>
                                ))}
                            </select>
                        </label>
                    );
                }

                // BOOLEAN (checkbox)
                if (typeof value === "boolean") {
                    return (
                        <label
                            key={key}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                            }}
                        >
                            <input
                                style={{marginLeft: "5px"}}
                                type="checkbox"
                                checked={value}
                                onChange={(e) => setter(e.target.checked)}
                            />
                            {key}
                        </label>
                    );
                }

                // NUMBERS
                if (typeof value === "number") {
                    return (
                        <label key={key}>
                            {key}
                            <input
                                style={{marginLeft: "5px"}}
                                type="number"
                                value={value}
                                onChange={(e) =>
                                    setter(Number(e.target.value))
                                }
                            />
                        </label>
                    );
                }

                // DEFAULT TEXT
                return (
                    <label key={key}>
                        {key}
                        <input
                            style={{marginLeft: "5px"}}
                            value={value}
                            onChange={(e) =>
                                setter(e.target.value)
                            }
                        />
                    </label>
                );
            })}
        </div>
    );
}

export default EditablePopup;