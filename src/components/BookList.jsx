import { useEffect, useState, useRef } from "react";
import EditablePopup from "./EditablePopup"
import TextElement from "./TextElement";

function BookList({
  books,
  editMode,
  settings,
  deleteBook,
  setBooks,
  setSettings
}) {
  const [editing, setEditing] = useState(false);
  const [bgColor, setBgColor] = useState("#c4ccd5");
  const [borderColor, setBorderColor] = useState("#c4ccd5");
  const [borderSize, setBorderSize] = useState(2);
  const [borderRadius, setBorderRadius] = useState(5);
  const [borderStyle, setBorderStyle] = useState("solid");
  const popupRef = useRef(null);

  // add any changes to settings the user makes
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      bookCard: {
        ...prev.bookCard,
        bgColor,
        borderColor,
        borderSize,
        borderStyle,
        borderRadius,
      },
    }));
  }, [bgColor,
      borderColor,
      borderSize,
      borderStyle,
      borderRadius,
      setSettings]);

  // Check for DataBase saved settings
  useEffect(() => {
    if (settings?.bookCard) {
      setBgColor(settings.bookCard.bgColor);
      setBorderColor(settings.bookCard.borderColor);
      setBorderSize(settings.bookCard.borderSize);
      setBorderStyle(settings.bookCard.borderStyle);
      setBorderRadius(settings.bookCard.borderRadius);
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
            bgColor: [bgColor, setBgColor],
            borderColor: [borderColor, setBorderColor],
            borderSize: [Number(borderSize), setBorderSize],
            borderStyle: [borderStyle, setBorderStyle],
            borderRadius: [Number(borderRadius), setBorderRadius],
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
              backgroundColor: bgColor,
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