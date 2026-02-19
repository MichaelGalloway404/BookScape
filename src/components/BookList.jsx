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
  deleteBook
}) {
  if (books.length === 0) {
    return <p>No books added yet.</p>;
  }

  return (
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
  );
}

export default BookList;
