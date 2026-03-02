function EditablePopup({
    popupRef,
    features,      // controls what shows up
    values,        // current values
    setters,       // setter functions
    fonts
}) {
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
            {/* Background Color */}
            {features.bgColor && (
                <input
                    type="color"
                    value={values.bgColor}
                    onChange={(e) => setters.setBgColor(e.target.value)}
                />
            )}

            {/* Text Editing */}
            {features.text && (
                <input
                    style={{ fontFamily: values.fontFamily }}
                    value={values.text}
                    onChange={(e) => setters.setText(e.target.value)}
                />
            )}

            {/* Font Family */}
            {features.fontFamily && (
                <label>
                    Choose font:
                    <select
                        value={values.fontFamily}
                        onChange={(e) =>
                            setters.setFontFamily(e.target.value)
                        }
                    >
                        {fonts.map((f) => (
                            <option key={f} value={f}>
                                {f}
                            </option>
                        ))}
                    </select>
                </label>
            )}

            {/* Font Size */}
            {features.fontSize && (
                <input
                    type="number"
                    value={values.fontSize}
                    onChange={(e) =>
                        setters.setFontSize(e.target.value)
                    }
                />
            )}
        </div>
    );
}
export default EditablePopup;