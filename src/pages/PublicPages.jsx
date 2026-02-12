import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function PublicPage() {
  const location = useLocation();
  const person = location.state?.user;

  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (!person) return;

    // If books are already included from API, use them
    if (Array.isArray(person.books) && person.books.length > 0) {
      let orderedBooks = person.books;

      // Respect book_order_json if present
      if (Array.isArray(person.book_order_json) && person.book_order_json.length > 0) {
        const orderMap = new Map(person.book_order_json.map((isbn, index) => [isbn, index]));
        orderedBooks = person.books.slice().sort((a, b) => {
          const aIndex = orderMap.get(a.isbn);
          const bIndex = orderMap.get(b.isbn);
          if (aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex;
          if (aIndex !== undefined) return -1;
          if (bIndex !== undefined) return 1;
          return 0;
        });
      }

      setBooks(orderedBooks);
    } else {
      setBooks([]); // fallback if no books
    }
  }, [person]);

  if (!person) {
    return <p>No user selected.</p>;
  }

  return (
    <div>
      <h1>Public Page for {person.username}</h1>
      <p><strong>ID:</strong> {person.id}</p>

      <h2>Books</h2>
      {books.length === 0 ? (
        <p>No books added yet.</p>
      ) : (
        <ul style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {books.map((book, i) => (
            <li key={i} style={{ listStyle: "none" }}>
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                alt={`Book ${book.isbn}`}
              />
              <p>ISBN: {book.isbn}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PublicPage;