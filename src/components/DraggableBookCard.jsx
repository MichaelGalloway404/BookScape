function DraggableBookCard({
  book,
  index,
  editMode,
  bgColor,
  borderColor,
  borderSize,
  handleDragStart,
  handleDragEnter,
  handleDragEnd,
  deleteBook
}) {
  return (
    <div
      style={{
        backgroundColor: bgColor,
        padding: "5px",
        border: `${borderSize}px solid ${borderColor}`,
        borderRadius: "8px"
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
        />

        <p>ISBN: {book.isbn}</p>
        <p>Title: {book.title}</p>

        {editMode && (
          <button onClick={() => deleteBook(book)}>
            Delete
          </button>
        )}
      </li>
    </div>
  );
}

export default DraggableBookCard;
