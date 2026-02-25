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
        <p> Author: {book.author} </p>
        <p> <h5><strong>{book.title}</strong></h5></p>

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
