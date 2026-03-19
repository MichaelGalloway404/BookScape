import { useEffect, useState, useRef } from "react";
import EditablePopup from "./EditablePopup"

function BookList({
  books,
  editMode,
  settings,
  deleteBook,
  setBooks,
  setSettings
}) {
  const [editing, setEditing] = useState(false);

  // ---------------- Main div Over Book Card ----------------
  const [bgColor, setBgColor] = useState(
    settings?.bookCard?.bgColor || "#ffffff"
  );
  const [bgColor2, setBgColor2] = useState(
    settings?.bookCard?.bgColor2 || "#c4ccd5"
  );
  const [borderColor, setBorderColor] = useState(
    settings?.bookCard?.borderColor || "#c4ccd5"
  );
  const [borderSize, setBorderSize] = useState(
    settings?.bookCard?.borderSize || 0
  );
  const [borderRadius, setBorderRadius] = useState(
    settings?.bookCard?.borderRadius || 0
  );
  const [borderStyle, setBorderStyle] = useState(
    settings?.bookCard?.borderStyle || "solid"
  );
  const [gradientAngle, setGradientAngle] = useState(
    settings?.bookCard?.gradientAngle || 0
  );
  const [padding, setPadding] = useState(
    settings?.bookCard?.padding || 0
  );
  const [margin, setMargin] = useState(
    settings?.bookCard?.margin || 0
  );
  const [backgroundOn, setBackgroundOn] = useState(
    settings?.bookCard?.backgroundOn || false
  );

  // ---------------- Card Image ----------------
  const [cardImgBorderColor, setCardImgBorderColor] = useState(
    settings?.bookCard?.cardImgBorderColor || "#ffffff"
  );
  const [cardImgBorderSize, setCardImgBorderSize] = useState(
    settings?.bookCard?.cardImgBorderSize || 0
  );
  const [cardImgBorderRadius, setCardImgBorderRadius] = useState(
    settings?.bookCard?.cardImgBorderRadius || 0
  );
  const [cardImgBorderStyle, setCardImgBorderStyle] = useState(
    settings?.bookCard?.cardImgBorderStyle || "solid"
  );
  const [cardImgWidth, setCardImgWidth] = useState(
    settings?.bookCard?.cardImgWidth || 0
  );

  // ---------------- Book Title ----------------
  const [titleColor, setTitleColor] = useState(
    settings?.bookCard?.titleColor || "white"
  );
  const [titleSize, setTitleSize] = useState(
    settings?.bookCard?.titleSize || 0
  );
  const [titlePadding, setTitlePadding] = useState(
    settings?.bookCard?.titlePadding || 0
  );
  const [titleMargin, setTitleMargin] = useState(
    settings?.bookCard?.titleMargin || 0
  );
  const [titleWidth, setTitleWidth] = useState(
    settings?.bookCard?.titleWidth || 0
  );
  const [titleFontFamily, setTitleFontFamily] = useState(
    settings?.bookCard?.titleFontFamily || "Arial"
  );

  // ---------------- Book Author ----------------
  const [authorColor, setAuthorColor] = useState(
    settings?.bookCard?.authorColor || "white"
  );
  const [authorSize, setAuthorSize] = useState(
    settings?.bookCard?.authorSize || 0
  );
  const [authorPadding, setAuthorPadding] = useState(
    settings?.bookCard?.authorPadding || 0
  );
  const [authorMargin, setAuthorMargin] = useState(
    settings?.bookCard?.authorMargin || 0
  );
  const [authorWidth, setAuthorWidth] = useState(
    settings?.bookCard?.authorWidth || 0
  );
  const [authorFontFamily, setAuthorFontFamily] = useState(
    settings?.bookCard?.authorFontFamily || "Arial"
  );

  const popupRef = useRef(null);

  // add any changes to settings the user makes
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      bookCard: {
        ...prev.bookCard,
        // Main div Over Book Card
        bgColor,
        bgColor2,
        borderColor,
        borderSize,
        borderStyle,
        borderRadius,
        gradientAngle,
        padding,
        margin,
        backgroundOn,
        // Card Image
        cardImgBorderColor,
        cardImgBorderSize,
        cardImgBorderRadius,
        cardImgBorderStyle,
        cardImgWidth,
        // Book Title
        titleColor,
        titleMargin,
        titlePadding,
        titleSize,
        titleWidth,
        titleFontFamily,
        // Book Author
        authorColor,
        authorMargin,
        authorPadding,
        authorSize,
        authorWidth,
        authorFontFamily,
      },
    }));
  }, [
    // Main div Over Book Card
    bgColor,
    bgColor2,
    borderColor,
    borderSize,
    borderStyle,
    borderRadius,
    gradientAngle,
    padding,
    margin,
    backgroundOn,
    // Card Image
    cardImgBorderColor,
    cardImgBorderSize,
    cardImgBorderRadius,
    cardImgBorderStyle,
    cardImgWidth,
    // Book Title
    titleColor,
    titleMargin,
    titlePadding,
    titleSize,
    titleWidth,
    titleFontFamily,
    // Book Author
    authorColor,
    authorMargin,
    authorPadding,
    authorSize,
    authorWidth,
    authorFontFamily,

    setSettings]);

  // Check for DataBase saved settings
  useEffect(() => {
    if (settings?.bookCard) {
      // Main div Over Book Card
      setBgColor(settings.bookCard.bgColor);
      setBgColor2(settings.bookCard.bgColor2);
      setBorderColor(settings.bookCard.borderColor);
      setBorderSize(settings.bookCard.borderSize);
      setBorderStyle(settings.bookCard.borderStyle);
      setBorderRadius(settings.bookCard.borderRadius);
      setGradientAngle(settings.bookCard.gradientAngle);
      setPadding(settings.bookCard.padding);
      setMargin(settings.bookCard.margin);
      if (settings.bookCard.backgroundOn !== undefined) setBackgroundOn(settings.bookCard.backgroundOn);
      // Card Image
      setCardImgBorderColor(settings.bookCard.cardImgBorderColor);
      setCardImgBorderSize(settings.bookCard.cardImgBorderSize);
      setCardImgBorderRadius(settings.bookCard.cardImgBorderRadius);
      setCardImgBorderStyle(settings.bookCard.cardImgBorderStyle);
      setCardImgWidth(settings.bookCard.cardImgWidth);
      // Book Title
      setTitleColor(settings.bookCard.titleColor);
      setTitleMargin(settings.bookCard.titleMargin);
      setTitlePadding(settings.bookCard.titlePadding);
      setTitleSize(settings.bookCard.titleSize);
      setTitleWidth(settings.bookCard.titleWidth);
      setTitleFontFamily(settings.bookCard.titleFontFamily);
      // Book Author
      setAuthorColor(settings.bookCard.authorColor);
      setAuthorMargin(settings.bookCard.authorMargin);
      setAuthorPadding(settings.bookCard.authorPadding);
      setAuthorSize(settings.bookCard.authorSize);
      setAuthorWidth(settings.bookCard.authorWidth);
      setAuthorFontFamily(settings.bookCard.authorFontFamily);
    }
  }, [settings]);

  // Item being dragged
  const dragItem = useRef(null);
  // DragOverItem will hold the index of the item currently being dragged over
  const dragOverItem = useRef(null);
  const handleDragStart = (index) => {
    // Store the index of the dragged item in the ref
    dragItem.current = index;
  };
  const handleDragEnter = (index) => {
    // Store the index of the item being hovered over
    dragOverItem.current = index;
  };

  // book has been dropped
  const handleDragEnd = () => {
    // If either ref is null, something went wrong, and only allow if in edit mode
    if (dragItem.current === null || dragOverItem.current === null || !editMode) return;
    // Shallow copy of existing book order
    const listCopy = [...books];
    // Save the content of the dragged item
    const draggedItemContent = listCopy[dragItem.current];

    // Remove the dragged item from its original position
    listCopy.splice(dragItem.current, 1);
    // Insert the dragged item into the new position
    listCopy.splice(dragOverItem.current, 0, draggedItemContent);

    // Reset refs
    dragItem.current = null;
    dragOverItem.current = null;

    // Update state with new order and trigger UI re-render
    setBooks(listCopy);
  };

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

  if (books.length === 0) {
    return <p>No books added yet.</p>;
  }

  return (
    <>
      {/* if in editmode and element has been clicked on */}
      {editing && editMode && (
        <EditablePopup
          popupRef={popupRef}
          controls={{
            // Main div Over Book Card
            "Card Back ON/OFF": [backgroundOn, setBackgroundOn],
            "Card Border Style": [borderStyle, setBorderStyle],
            "break0": "",
            "Card Back Color 1": [bgColor, setBgColor],
            "Card Back Color 2": [bgColor2, setBgColor2],
            "Card Border Color": [borderColor, setBorderColor],
            "Card Border Size": [Number(borderSize), setBorderSize],
            "Card Border Radius": [Number(borderRadius), setBorderRadius],
            "Card Gradient Angle": [Number(gradientAngle), setGradientAngle],
            "Card Padding": [Number(padding), setPadding],
            "Card margin": [Number(margin), setMargin],
            "break1": "",
            // Card Image
            "Image Border Color": [cardImgBorderColor, setCardImgBorderColor],
            "Image Border Size": [Number(cardImgBorderSize), setCardImgBorderSize],
            "Image Border Radius": [Number(cardImgBorderRadius), setCardImgBorderRadius],
            "Image Border Style": [cardImgBorderStyle, setCardImgBorderStyle],
            "Image Width": [Number(cardImgWidth), setCardImgWidth],
            "break2": "",
            // Book Title
            "Book Title Margin": [Number(titleMargin), setTitleMargin],
            "Book Title Padding": [Number(titlePadding), setTitlePadding],
            "Book Title Size": [Number(titleSize), setTitleSize],
            "Book Title Color": [titleColor, setTitleColor],
            "Book Title Width": [Number(titleWidth), setTitleWidth],
            "Book Title Fount Family": [titleFontFamily, setTitleFontFamily],
            "break3": "",
            // Book Author
            "Book Author Margin": [Number(authorMargin), setAuthorMargin],
            "Book Author Padding": [Number(authorPadding), setAuthorPadding],
            "Book Author Size": [Number(authorSize), setAuthorSize],
            "Book Author Color": [authorColor, setAuthorColor],
            "Book Author Width": [Number(authorWidth), setAuthorWidth],
            "Book Author Fount Family": [authorFontFamily, setAuthorFontFamily],
          }}
        />
      )}
      <ul style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
        onClick={(e) => {
          if (editMode) {
            setEditing(true);
          }
        }}>
        {books.map((book, index) => (
          // -------------------- Draggable Book Card --------------------------------
          <div
            key={book.isbn || index}  // always give a unique key
            style={{
              background: (backgroundOn ? `linear-gradient(${gradientAngle}deg, ${bgColor},${bgColor2})` : "none"),
              padding: padding + "px",
              margin: margin + "px",
              border: `${borderSize}px ${borderStyle} ${borderColor}`,
              borderRadius: borderRadius + "px",
              maxWidth: "30%",
            }}
          >
            <li
              style={{ listStyle: "none" }}
              draggable={editMode}
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                alt="Book cover"
                style={{
                  width: cardImgWidth + "px",
                  border: `${cardImgBorderSize}px ${cardImgBorderStyle} ${cardImgBorderColor}`,
                  borderRadius: cardImgBorderRadius + "px",
                }}
              />

              <div>
                {/* TITLE */}
                <p
                  style={{
                    color: titleColor,
                    margin: titleMargin + "px",
                    padding: titlePadding + "px",
                    fontSize: titleSize + "px",
                    width: titleWidth + "px",
                    fontFamily: titleFontFamily,
                  }}
                >{book.title}</p>
                {/* AUTHOR */}
                <p
                  style={{
                    color: authorColor,
                    margin: authorMargin + "px",
                    padding: authorPadding + "px",
                    fontSize: authorSize + "px",
                    width: authorWidth + "px",
                    fontFamily: authorFontFamily,
                  }}
                >{book.author}</p>

                {editMode && (
                  <button style={{ backgroundColor: "#ff2727b5", color: "black", borderRadius: "5px", position: "absolute" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBook(book);
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          </div>
        ))}
        {/* // -------------------------------------------------------------------------------------- */}
      </ul>
    </>
  );
}

export default BookList;