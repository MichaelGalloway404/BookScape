import { useState } from "react";
import axios from "axios";
import styles from "./BookSearch.module.css"

const BOOKS_PER_PAGE = 10;

export default function BookSearch() {
  // use state vars as to not rerender if needed
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);

  async function searchForBooks() {
    // The URLSearchParams interface defines utility methods to work with the query string of a URL.
    // URLSearchParams objects are iterable
    const params = new URLSearchParams();
    if (title) params.append("title", title);   // add title to query if user typed it
    if (author) params.append("author", author);// add auther to query if user typed it

    try {
      // params.toString() converts URLSearchParams into a query string
      const res = await axios.get(
        `https://openlibrary.org/search.json?${params.toString()}`
      );

      // If docs is undefined or null, fall back to an empty array
      const covers = (res.data.docs || [])

        // Only keep books that have a cover image ID
        // cover_i is required to generate a valid cover image URL
        .filter(doc => doc.cover_i)

        // Transform each book object into a cleaner format
        .map(doc => ({
          // Book title
          title: doc.title,

          // Join multiple author names into a single string
          // If author_name is missing, fall back to an empty array
          author: (doc.author_name || []).join(", "),

          // Build the Open Library cover image URL using the cover ID
          // -M indicates medium-sized image there is also -S and -L
          coverUrl: `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`,

          // Safely grab the first ISBN if it exists
          // Optional chaining (?.) prevents runtime errors
          // If no ISBN exists, store null
          isbn: doc.isbn?.[0] || null
        }));

      // Update React state with the formatted book results
      setResults(covers);

      setPage(0); // reset to first page on new search


    } catch (err) {
      console.error(err);
      alert("Search failed");
    }

  }

  const totalPages = Math.ceil(results.length / BOOKS_PER_PAGE);

  const visibleBooks = results.slice(
    page * BOOKS_PER_PAGE,
    (page + 1) * BOOKS_PER_PAGE
  );

  function nextPage() {
    setPage(prev => (prev + 1) % totalPages);
  }

  function prevPage() {
    setPage(prev => (prev - 1 + totalPages) % totalPages);
  }


  return (
    <div>
      {/* testing out css modules */}
      <h2 className={styles.testCss}>Search Books</h2>

      {/* Title input field */}
      <input
        placeholder="Title"

        // Value comes from React state
        value={title}

        // Update the title state whenever the user types
        onChange={e => setTitle(e.target.value)}
      />

      {/* Author input field */}
      <input
        placeholder="Author"

        // Author state
        value={author}

        // Update the author state on every keystroke
        onChange={e => setAuthor(e.target.value)}
      />

      {/* Button that triggers the Open Library search */}
      <button
        // When clicked, runs the async search function
        onClick={searchForBooks}
      >
        Search
      </button>

      {/* List container for search results */}
      <ul className={styles.bookCoverGrid}>

        {/* Loop over the results array and render one <li> per book */}
        {visibleBooks.map((book, i) => (
          // Each list items have a unique key for React
          <li className={styles.bookCard} key={i}>

            {/* Book cover image */}
            <img
              // URL built from the Open Library cover ID
              src={book.coverUrl}

              // screen readers text classic html
              alt={book.title}
            />

            {/* Book title */}
            <p>
              <strong>{book.title}</strong>
            </p>

            {/* Book author */}
            <p>{book.author}</p>

            {/* Book ISBN (can be null) */}
            <p>ISBN: {book.isbn}</p>

          </li>
        ))}

      </ul>
      {/* Pagination controls */}
      {results.length > BOOKS_PER_PAGE && (
        <div className={styles.pagination}>
          <button onClick={prevPage}>Previous</button>

          <span>
            Page {page + 1} of {totalPages}
          </span>

          <button onClick={nextPage}>Next</button>
        </div>
      )}
    </div>
  );

}
