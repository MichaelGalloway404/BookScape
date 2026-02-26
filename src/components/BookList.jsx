import DraggableBookCard from "./DraggableBookCard";

function BookList({
  books,
  editMode,
  handleDragStart,
  handleDragEnter,
  handleDragEnd,
  deleteBook
}) {
  const [bgColor, setBgColor] = useState("#1523be");
  const [borderColor, setBorderColor] = useState("#181b44");
  const [borderSize, setBorderSize] = useState("2");
  const [pageBckColor, setPageBckColor] = useState("wheat");

  // will load color for background from user settings later
      useEffect(() => {
          // save the original background
          const originalBackground = document.body.style.background;
  
          // apply the page background
          document.body.style.background = pageBckColor;
  
          // cleanup function runs when the component unmounts
          return () => {
              document.body.style.background = originalBackground;
          };
      }, [pageBckColor]);


  if (books.length === 0) {
    return <p>No books added yet.</p>;
  }

  return (
    <>
      {editMode && (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <p>BookCard Color</p>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />

          <p>Border Size</p>
          <input
            style={{ height: "20px", width: "50px" }}
            type="number"
            min="0"
            value={borderSize}
            onChange={(e) => setBorderSize(Number(e.target.value))}
          />

          <p>BookCard Border Color</p>
          <input
            type="color"
            value={borderColor}
            onChange={(e) => setBorderColor(e.target.value)}
          />

          <p>Page Background Color</p>
          <input
            type="color"
            value={pageBckColor}
            onChange={(e) => setPageBckColor(e.target.value)}
          />
        </div>
      )}
      <ul style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {books.map((book, i) => (
          <DraggableBookCard
            key={`${book.isbn}-${book.cover_id}`}
            book={book}
            index={i}
            editMode={editMode}
            bgColor={bgColor}
            borderColor={borderColor}
            borderSize={borderSize}
            handleDragStart={handleDragStart}
            handleDragEnter={handleDragEnter}
            handleDragEnd={handleDragEnd}
            deleteBook={deleteBook}
          />
        ))}
      </ul>
    </>
  );
}

export default BookList;
