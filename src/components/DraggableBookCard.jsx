import React, { useState, useEffect, useRef } from "react";

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
  const [expanded, setExpanded] = useState(false);

  const popupRef = useRef(null);

  async function fetchWikiSummary() {
    // Toggle closed if already open
    if (expanded) {
      setExpanded(false);
      return;
    }


    try {
      const searchQuery = encodeURIComponent(
        `${book.title} ${book.author || ""}`
      );

      const searchUrl =
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchQuery}&format=json&origin=*`;

      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (!searchData.query.search.length) {
        setSummary("So no info avalible");
        setExpanded(true);
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
        return;
      }

      const data = await summaryResponse.json();

      setSummary(data.extract);
      setExpanded(true);

    } catch (error) {
      setSummary("Error fetching Wikipedia summary.");
      setExpanded(true);
    }

  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setExpanded(false);
      }
    }

    if (expanded) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expanded]);

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
      {!editMode && expanded && summary && (
          <div
            ref={popupRef}
            style={{
              position: "absolute",
              background: "white",
              padding: "1rem",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              zIndex: 1000,
              maxWidth: "300px",
            }}
          >
            {summary}
          </div>
        )}
      <li
        style={{ listStyle: "none", width: "150px" }}
        draggable={editMode}
        onDragStart={() => handleDragStart(index)}
        onDragEnter={() => handleDragEnter(index)}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => { if (!expanded) setExpanded(true); }}
      >
        <img
          src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
          alt="Book cover"
          style={{
            width: "100px",
            marginBottom: "8px"
          }}
        />

        <p ><strong>{book.title}</strong></p>
        <p >Author: {book.author}</p>

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
  );
}

export default DraggableBookCard;