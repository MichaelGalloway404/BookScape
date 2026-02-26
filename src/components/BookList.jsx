import DraggableBookCard from "./DraggableBookCard";

function BookList({
  books,
  editMode,
  bgColor,
  borderColor,
  borderSize,
  handleDragStart,
  handleDragEnter,
  handleDragEnd,
  pageBckColor,
  setBgColor,
  setBorderColor,
  setPageBckColor,
  setBorderSize,
  deleteBook
}) {
  if (books.length === 0) {
    return <p>No books added yet.</p>;
  }

  return (
    <>
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
        <input
          type="color"
          value={pageBckColor}
          onChange={(e) => setPageBckColor(e.target.value)}
        />
      </div>
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
