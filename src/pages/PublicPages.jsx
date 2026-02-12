import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function PublicPage() {
  const location = useLocation();
  const person = location.state?.user;

  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (!person) return;

    // If book_order_json exists, create an array of book objects with ISBNs in order
    if (Array.isArray(person.book_order_json) && person.book_order_json.length > 0) {
      const orderedBooks = person.book_order_json.map(isbn => ({ isbn }));
      setBooks(orderedBooks);
    } else {
      setBooks([]); // fallback if no books
    }
  }, [person]);

  if (!person) {
    return <p>No user data provided.</p>;
  }

  return (
    <div>
      <h1>Public Page for {person.username}</h1>
      <p><strong>ID:</strong> {person.id}</p>
      <p><strong>Username:</strong> {person.username}</p>

      <h2>Books</h2>
      {books.length === 0 ? (
        <p>No books added yet.</p>
      ) : (
        <ul style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {books.map((book, i) => (
            <li key={i} style={{ listStyle: "none" }}>
              <img
                src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`}
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
