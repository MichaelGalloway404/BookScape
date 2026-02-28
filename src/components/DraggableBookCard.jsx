import React, { useState } from "react";

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
  deleteBook,
}) {

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function fetchWikiSummary() {
    // Toggle closed if already open
    if (expanded) {
      setExpanded(false);
      return;
    }

    setLoading(true);

    try {
      const searchQuery = encodeURIComponent(
        `${book.title} ${book.author || ""}`
      );

      const searchUrl =
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchQuery}&format=json&origin=*`;

      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (!searchData.query.search.length) {
        setSummary("No Wikipedia page found.");
        setExpanded(true);
        setLoading(false);
        return;
      }

      const bestTitle =
        searchData.query.search[0].title.replace(/ /g, "_");

      const summaryUrl =
        `https://en.wikipedia.org/api/rest_v1/page/summary/${bestTitle}`;

      const summaryResponse = await fetch(summaryUrl);

      if (!summaryResponse.ok) {
        setSummary("Could not retrieve summary.");
        setExpanded(true);
        setLoading(false);
        return;
      }

      const data = await summaryResponse.json();

      setSummary(data.extract);
      setExpanded(true);

    } catch (error) {
      setSummary("Error fetching Wikipedia summary.");
      setExpanded(true);
    }

    setLoading(false);
  }

  return (
    <div 
      style={{
        backgroundColor: bgColor,
        padding: "10px",
        border: `${borderSize}px solid ${borderColor}`,
        borderRadius: "8px",
        cursor: "pointer",
        marginBottom: "10px",
        transition: "all 0.2s ease",
        maxWidth: "30%"
      }}
      onClick={!editMode ? fetchWikiSummary : undefined}
    >
      <li
        style={{ listStyle: "none"}}
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
            // width: "100px", 
            marginBottom: "8px" }}
        />

        <p style={{maxWidth: "200px"}}><strong>{book.title}</strong></p>
        <p style={{maxWidth: "200px"}}>Author: {book.author}</p>

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

        {loading && (
          <p style={{ fontStyle: "italic" }}>
            Loading summary...
          </p>
        )}

        {expanded && summary && (
          <div
            style={{
              marginTop: "10px",
              padding: "10px",
              backgroundColor: "#000000",
              borderRadius: "6px",
              fontSize: "0.9rem",
              lineHeight: "1.4"
            }}
          >
            {summary}
          </div>
        )}
      </li>
    </div>
  );
}

export default DraggableBookCard;