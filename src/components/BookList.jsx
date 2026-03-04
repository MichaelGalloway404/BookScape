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

  // State for Main div Over Book Card
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgColor2, setBgColor2] = useState("#c4ccd5");
  const [borderColor, setBorderColor] = useState("#c4ccd5");
  const [borderSize, setBorderSize] = useState(2);
  const [borderRadius, setBorderRadius] = useState(5);
  const [borderStyle, setBorderStyle] = useState("solid");
  const [gradientAngle, setGradientAngle] = useState(135);

  // State for Card Image
  const [cardImgBorderColor, setCardImgBorderColor] = useState("#ffffff")
  const [cardImgBorderSize, setCardImgBorderSize] = useState(2);
  const [cardImgBorderRadius, setCardImgBorderRadius] = useState(5);
  const [cardImgBorderStyle, setCardImgBorderStyle] = useState("solid");
  const [cardImgWidth, setCardImgWidth] = useState(100);

  // State for Book Title
  // State for Book Author

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
        // Card Image
        cardImgBorderColor,
        cardImgBorderSize,
        cardImgBorderRadius,
        cardImgBorderStyle,
        cardImgWidth,
        // Book Title
        // Book Author
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
    // Card Image
    cardImgBorderColor,
    cardImgBorderSize,
    cardImgBorderRadius,
    cardImgBorderStyle,
    cardImgWidth,
    // Book Title
    // Book Author
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
      // Card Image
      setCardImgBorderColor(settings.bookCard.cardImgBorderColor);
      setCardImgBorderSize(settings.bookCard.cardImgBorderSize);
      setCardImgBorderRadius(settings.bookCard.cardImgBorderRadius);
      setCardImgBorderStyle(settings.bookCard.cardImgBorderStyle);
      setCardImgWidth(settings.bookCard.cardImgWidth);
      // Book Title
      // Book Author
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
            bgColor: [bgColor, setBgColor],
            bgColor2: [bgColor2, setBgColor2],
            borderColor: [borderColor, setBorderColor],
            borderSize: [Number(borderSize), setBorderSize],
            borderStyle: [borderStyle, setBorderStyle],
            borderRadius: [Number(borderRadius), setBorderRadius],
            gradientAngle: [Number(gradientAngle), setGradientAngle],
            // Card Image
            cardImgBorderColor: [cardImgBorderColor, setCardImgBorderColor],
            cardImgBorderSize: [Number(cardImgBorderSize), setCardImgBorderSize],
            cardImgBorderRadius: [Number(cardImgBorderRadius), setCardImgBorderRadius],
            cardImgBorderStyle: [cardImgBorderStyle, setCardImgBorderStyle],
            cardImgWidth: [Number(cardImgWidth), setCardImgWidth],
            // Book Title
            // Book Author

          }}
        />
      )}
      <ul style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
        onClick={() => { if (editMode) setEditing(true); }}>
        {books.map((book, index) => (
          // -------------------- Draggable Book Card --------------------------------
          <div
            key={book.isbn || index}  // always give a unique key
            style={{
              background: `linear-gradient(${gradientAngle}deg, ${bgColor},${bgColor2})`,
              padding: "10px",
              border: `${borderSize}px ${borderStyle} ${borderColor}`,
              borderRadius: borderRadius + "px",
              marginBottom: "10px",
              maxWidth: "30%",
            }}
          >
            <li
              style={{ listStyle: "none", width: "150px" }}
              draggable={editMode}
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                alt="Book cover"
                style={{ width: "100px", marginBottom: "8px" }}
              />

              <p>{book.title}</p>
              <p>{book.author}</p>

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