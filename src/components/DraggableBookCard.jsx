import React from "react";

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

  async function fetchWikiSummary() {
    try {
      const searchQuery = encodeURIComponent(
        `${book.title} ${book.author || ""} novel`
      );

      const searchUrl =
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchQuery}&format=json&origin=*`;

      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      // If no search results → open generic Wikipedia search
      if (!searchData.query.search.length) {
        openWikiSearch();
        return;
      }

      const bestTitle =
        searchData.query.search[0].title.replace(/ /g, "_");

      const summaryUrl =
        `https://en.wikipedia.org/api/rest_v1/page/summary/${bestTitle}`;

      const summaryResponse = await fetch(summaryUrl);

      // If summary fails → open generic search
      if (!summaryResponse.ok) {
        openWikiSearch();
        return;
      }

      const data = await summaryResponse.json();

      alert(`${data.title}\n\n${data.extract}`);

    } catch (error) {
      openWikiSearch();
    }
  }

  function openWikiSearch() {
    const wikiSearchUrl =
      `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(
        `${book.title} ${book.author || ""}`
      )}`;

    window.open(wikiSearchUrl, "_blank");
  }

  // ✅ JSX must be returned from component — not from fetch function
  return (
    <div
      style={{
        backgroundColor: bgColor,
        padding: "5px",
        border: `${borderSize}px solid ${borderColor}`,
        borderRadius: "8px",
        cursor: "pointer"
      }}
      onClick={!editMode ? fetchWikiSummary : undefined}
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
        <p>Author: {book.author}</p>
        <p style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
          {book.title}
        </p>

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