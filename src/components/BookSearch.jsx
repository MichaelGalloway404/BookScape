import { useState } from "react";
import axios from "axios";

export default function BookSearch() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [results, setResults] = useState([]);

  async function search() {
    const params = new URLSearchParams();
    if (title) params.append("title", title);
    if (author) params.append("author", author);

    try {
      const res = await axios.get(
        `https://openlibrary.org/search.json?${params.toString()}`
      );

      const covers = (res.data.docs || [])
        .filter(doc => doc.cover_i)
        .map(doc => ({
          title: doc.title,
          author: (doc.author_name || []).join(", "),
          coverUrl: `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`,
          isbn: doc.isbn?.[0] || null
        }));

      setResults(covers);
    } catch (err) {
      console.error(err);
      alert("Search failed");
    }
  }

  return (
    <div>
      <h2>Search Books</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <input
        placeholder="Author"
        value={author}
        onChange={e => setAuthor(e.target.value)}
      />

      <button onClick={search}>Search</button>

      <ul>
        {results.map((book, i) => (
          <li key={i}>
            <img src={book.coverUrl} alt={book.title} />
            <p><strong>{book.title}</strong></p>
            <p>{book.author}</p>
            <p>ISBN: {book.isbn}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
