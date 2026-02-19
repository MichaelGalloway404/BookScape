function BookStyleControls({
  bgColor,
  borderColor,
  borderSize,
  setBgColor,
  setBorderColor,
  setBorderSize
}) {
  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <input
        type="color"
        value={bgColor}
        onChange={(e) => setBgColor(e.target.value)}
      />

      <input
        style={{ height: "20px", width: "50px" }}
        type="number"
        min="1"
        value={borderSize}
        onChange={(e) => setBorderSize(Number(e.target.value))}
      />

      <input
        type="color"
        value={borderColor}
        onChange={(e) => setBorderColor(e.target.value)}
      />
    </div>
  );
}

export default BookStyleControls;
