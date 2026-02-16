import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import SiteInfoFooter from '../components/SiteInfoFooter';

function PublicPage() {
  const location = useLocation();
  const person = location.state?.user;

  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (!person) return;

    const loadBooks = async () => {
      try {
        const res = await fetch(`/api/publicUserBooks?userId=${person.id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch books");

        let orderedBooks = data;

        // respect book_order_json
        if (Array.isArray(person.book_order_json) && person.book_order_json.length > 0) {
          const orderMap = new Map(person.book_order_json.map((isbn, index) => [isbn, index]));
          orderedBooks = data.slice().sort((a, b) => {
            const aIndex = orderMap.get(a.isbn);
            const bIndex = orderMap.get(b.isbn);
            if (aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex;
            if (aIndex !== undefined) return -1;
            if (bIndex !== undefined) return 1;
            return 0;
          });
        }

        setBooks(orderedBooks);
      } catch (err) {
        console.error(err);
      }
    };

    loadBooks();
  }, [person]);

  if (!person) return <p>No user selected.</p>;

  return (
    <>
      <h1>Public Page for {person.username}</h1>

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
      <SiteInfoFooter/>
    </>
  );
}

export default PublicPage;
