import fonts from "../styles/fonts";

function EditablePopup({ popupRef, controls = {} }) {
    return (
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
            {Object.entries(controls).map(([key, [value, setter]]) => {

                // COLOR PICKERS
                if (key.toLowerCase().includes("color")) {
                    return (
                        <label key={key}>
                            {key}
                            <input
                                type="color"
                                value={value}
                                onChange={(e) => setter(e.target.value)}
                            />
                        </label>
                    );
                }

                // FONT FAMILY
                if (key === "fontFamily") {
                    return (
                        <label key={key}>
                            Choose font:
                            <select
                                value={value}
                                onChange={(e) => setter(e.target.value)}
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

                // NUMBERS
                if (typeof value === "number") {
                    return (
                        <label key={key}>
                            {key}
                            <input
                                type="number"
                                value={value}
                                onChange={(e) =>
                                    setter(Number(e.target.value))
                                }
                            />
                        </label>
                    );
                }

                // DEFAULT TEXT INPUT
                return (
                    <label key={key}>
                        {key}
                        <input
                            value={value}
                            onChange={(e) => setter(e.target.value)}
                        />
                    </label>
                );
            })}
        </div>
    );
}

export default EditablePopup;