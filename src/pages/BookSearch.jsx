import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./BookSearch.module.css"
import { useNavigate } from "react-router-dom";

const BOOKS_PER_PAGE = 10;

export default function BookSearch() {
  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // const isbn = "9780439554930";
  // const coverSize = "M";
  // const coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-${coverSize}.jpg`;

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/currentUser", {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Not authenticated");
        }

        setUser(data);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    loadUser();
  }, [navigate]);

  // add a book
  async function addBook(book) {
    try {
      await axios.post(
        "/api/userBooks",
        {
          isbn: book.isbn === "null" ? null : book.isbn,
          cover_id: book.coverUrl.split("/b/id/")[1].split("-")[0],
        },
        { withCredentials: true }
      );

      alert("Book added");
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Book already added");
      } else {
        console.error(err);
        alert("Failed to add book");
      }
    }
  }


  async function searchForBooks() {
    try {
      // ---------- ISBN DIRECT LOOKUP ----------
      if (isbn.trim() && !title.trim() && !author.trim()) {

        const cleanIsbn = isbn.trim();
        const coverSize = "M";

        const coverUrl = `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-${coverSize}.jpg`;

        // Create a fake "result" object so UI still works
        const bookResult = [{
          title: "Unknown Title",
          author: "Unknown Author",
          coverUrl,
          isbn: cleanIsbn
        }];

        setResults(bookResult);
        setPage(0);
        return;
      }

      // The URLSearchParams interface defines utility methods to work with the query string of a URL.
      // URLSearchParams objects are iterable
      const params = new URLSearchParams();

      // If ISBN is provided, search ONLY by ISBN (most precise)
      if (isbn.trim()) {
        params.append("isbn", isbn.trim());
      }


      // Otherwise use title/author search
      if (title) params.append("title", title);   // add title to query if user typed it
      if (author) params.append("author", author);// add auther to query if user typed it


      // Ask Open Library to include isbn explicitly
      params.append("fields", "cover_i,title,author_name,isbn");
      params.append("limit", "20");





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
          isbn: doc.isbn?.[0] || "null"
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


  if (!user) {
    return <p>Loading user...</p>;
  }

  return (
    <>
      {/* show who is searching */}
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Username:</strong> {user.username}</p>
      {/* testing out css modules */}
      <h2>Search Books</h2>

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
      {/* ISBN field */}
      <input
        placeholder="ISBN"
        value={isbn}
        onChange={e => setIsbn(e.target.value)}
      />


      {/* Button that triggers the Open Library search */}
      <button
        // When clicked, runs the async search function
        onClick={searchForBooks}
      >
        Search
      </button>

      {visibleBooks.length > 0 && (
        /* List container for search results */
        <ul className={styles.bookCoverGrid}>

          {/* Loop over the results array and render one <li> per book */}
          {visibleBooks.map((book, i) => (
            // Each list items have a unique key for React
            <li className={styles.bookCard} key={i}>

              {/* Book cover image */}
              <img className={styles.coverImage}
                // URL built from the Open Library cover ID
                src={book.coverUrl}

                // screen readers text classic html
                alt={book.title}
              />

              {/* Book title */}
              <p className={styles.bookInfo} >
                <h5><strong>{book.title}</strong></h5>
              </p>

              {/* Book author */}
              <p className={styles.bookInfo} >
                Author: {book.author}
              </p>
              {/* Book ISBN */}
              <p className={styles.bookInfo} >
                ISBN: {book.isbn}
              </p>
              {/* add a book to user db */}
              <button
                onClick={() => addBook(book)}
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      )}

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
      <button onClick={() => navigate("/second")}>
        Back to userPage
      </button>
    </>
  );

}
