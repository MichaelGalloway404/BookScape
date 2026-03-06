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
    settings?.bookCard?.borderSize || 2
  );
  const [borderRadius, setBorderRadius] = useState(
    settings?.bookCard?.borderRadius || 5
  );
  const [borderStyle, setBorderStyle] = useState(
    settings?.bookCard?.borderStyle || "solid"
  );
  const [gradientAngle, setGradientAngle] = useState(
    settings?.bookCard?.gradientAngle || 135
  );
  const [padding, setPadding] = useState(
    settings?.bookCard?.padding || 10
  );
  const [margin, setMargin] = useState(
    settings?.bookCard?.margin || 0
  );

  // ---------------- Card Image ----------------
  const [cardImgBorderColor, setCardImgBorderColor] = useState(
    settings?.bookCard?.cardImgBorderColor || "#ffffff"
  );
  const [cardImgBorderSize, setCardImgBorderSize] = useState(
    settings?.bookCard?.cardImgBorderSize || 2
  );
  const [cardImgBorderRadius, setCardImgBorderRadius] = useState(
    settings?.bookCard?.cardImgBorderRadius || 5
  );
  const [cardImgBorderStyle, setCardImgBorderStyle] = useState(
    settings?.bookCard?.cardImgBorderStyle || "solid"
  );
  const [cardImgWidth, setCardImgWidth] = useState(
    settings?.bookCard?.cardImgWidth || 100
  );

  // ---------------- Book Title ----------------
  const [titleColor, setTitleColor] = useState(
    settings?.bookCard?.titleColor || "white"
  );
  const [titleSize, setTitleSize] = useState(
    settings?.bookCard?.titleSize || 20
  );
  const [titlePadding, setTitlePadding] = useState(
    settings?.bookCard?.titlePadding || 5
  );
  const [titleMargin, setTitleMargin] = useState(
    settings?.bookCard?.titleMargin || 0
  );
  const [titleWidth, setTitleWidth] = useState(
    settings?.bookCard?.titleWidth || 100
  );

  // ---------------- Book Author ----------------
  const [authorColor, setAuthorColor] = useState(
    settings?.bookCard?.authorColor || "white"
  );
  const [authorSize, setAuthorSize] = useState(
    settings?.bookCard?.authorSize || 20
  );
  const [authorPadding, setAuthorPadding] = useState(
    settings?.bookCard?.authorPadding || 5
  );
  const [authorMargin, setAuthorMargin] = useState(
    settings?.bookCard?.authorMargin || 0
  );
  const [authorWidth, setAuthorWidth] = useState(
    settings?.bookCard?.authorWidth || 100
  );

  const popupRef = useRef(null);
  const [popupPosition, setPopupPosition] = useState(null);

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
        // Book Author
        authorColor,
        authorMargin,
        authorPadding,
        authorSize,
        authorWidth,
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
    // Book Author
    authorColor,
    authorMargin,
    authorPadding,
    authorSize,
    authorWidth,

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
      // Book Author
      setAuthorColor(settings.bookCard.authorColor);
      setAuthorMargin(settings.bookCard.authorMargin);
      setAuthorPadding(settings.bookCard.authorPadding);
      setAuthorSize(settings.bookCard.authorSize);
      setAuthorWidth(settings.bookCard.authorWidth);
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
          initialPosition={popupPosition}
          controls={{
            // Main div Over Book Card
            "Card Back Color 1": [bgColor, setBgColor],
            "Card Back Color 2": [bgColor2, setBgColor2],
            "Card Border Color": [borderColor, setBorderColor],
            "Card Border Size": [Number(borderSize), setBorderSize],
            "Card Border Style": [borderStyle, setBorderStyle],
            "Card Border Radius": [Number(borderRadius), setBorderRadius],
            "Card Gradient Angle": [Number(gradientAngle), setGradientAngle],
            "Card Padding": [Number(padding), setPadding],
            "Card margin": [Number(margin), setMargin],
            "break1": "place holder",
            // Card Image
            "Image Border Color": [cardImgBorderColor, setCardImgBorderColor],
            "Image Border Size": [Number(cardImgBorderSize), setCardImgBorderSize],
            "Image Border Radius": [Number(cardImgBorderRadius), setCardImgBorderRadius],
            "Image Border Style": [cardImgBorderStyle, setCardImgBorderStyle],
            "Image Width": [Number(cardImgWidth), setCardImgWidth],
            "break2": "place holder",
            // Book Title
            "Book Title Margin": [Number(titleMargin), setTitleMargin],
            "Book Title Padding": [Number(titlePadding), setTitlePadding],
            "Book Title Size": [Number(titleSize), setTitleSize],
            "Book Title Color": [titleColor, setTitleColor],
            "Book Title Width": [Number(titleWidth), setTitleWidth],
            "break3": "place holder",
            // Book Author
            "Book Author Margin": [Number(authorMargin), setAuthorMargin],
            "Book Author Padding": [Number(authorPadding), setAuthorPadding],
            "Book Author Size": [Number(authorSize), setAuthorSize],
            "Book Author Color": [authorColor, setAuthorColor],
            "Book Author Width": [Number(authorWidth), setAuthorWidth],

          }}
        />
      )}
      <ul style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
        onClick={(e) => {
          if (editMode) {
            setPopupPosition({
              x: e.pageX,
              y: e.pageY,
            });
            setEditing(true);
          }
        }}>
        {books.map((book, index) => (
          // -------------------- Draggable Book Card --------------------------------
          <div
            key={book.isbn || index}  // always give a unique key
            style={{
              background: `linear-gradient(${gradientAngle}deg, ${bgColor},${bgColor2})`,
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
                  }}
                >{book.author}</p>
              </div>

              {editMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteBook(book);
                  }}
                >
                  Delete
                </button>
              )}
            </li>
          </div>
        ))}
        {/* // -------------------------------------------------------------------------------------- */}
      </ul>
    </>
  );
}

export default BookList;