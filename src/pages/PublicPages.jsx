import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import SiteInfoFooter from "../components/SiteInfoFooter";
import BookList from "../components/BookList";
import TextComponent from "../components/TextComponent";

function PublicPage() {
  const location = useLocation();
  const person = location.state?.user;

  const [books, setBooks] = useState([]);
  const [settings, setSettings] = useState({});
  const [pageBckColor, setPageBckColor] = useState("#c4ccd5");
  const [pageBckColor2, setPageBckColor2] = useState("#c4ccd5");
  const [gradientAngle, setGradientAngle] = useState(135);

  // Load books + settings
  useEffect(() => {
    if (!person) return;

    const loadPublicData = async () => {
      try {
        // ---------------- GET BOOKS ----------------
        const booksRes = await fetch(`/api/publicUserBooks?userId=${person.id}`);
        const booksData = await booksRes.json();
        if (!booksRes.ok) throw new Error("Failed to fetch books");

        let orderedBooks = booksData;

        if (Array.isArray(person.book_order_json) && person.book_order_json.length > 0) {
          const orderMap = new Map(
            person.book_order_json.map((isbn, index) => [isbn, index])
          );

          orderedBooks = booksData.slice().sort((a, b) => {
            const aIndex = orderMap.get(a.isbn);
            const bIndex = orderMap.get(b.isbn);

            if (aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex;
            if (aIndex !== undefined) return -1;
            if (bIndex !== undefined) return 1;
            return 0;
          });
        }

        setBooks(orderedBooks);

        // ---------------- GET SETTINGS ----------------
        const settingsRes = await fetch(
          `/api/publicUserSettings?userId=${person.id}`
        );

        const settingsData = await settingsRes.json();

        if (settingsRes.ok) {
          setSettings(settingsData || {});
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadPublicData();
  }, [person]);

  // Apply saved page background settings
  useEffect(() => {
    if (settings?.mainPage) {
      setPageBckColor(settings.mainPage.pageBckColor);
      setPageBckColor2(settings.mainPage.pageBckColor2);
      setGradientAngle(settings.mainPage.gradientAngle);
    }
  }, [settings]);

  // Apply gradient to body
  useEffect(() => {
    const originalBackground = document.body.style.background;

    document.body.style.background = `linear-gradient(${gradientAngle}deg, ${pageBckColor}, ${pageBckColor2})`;

    return () => {
      document.body.style.background = originalBackground;
    };
  }, [pageBckColor, pageBckColor2, gradientAngle]);

  if (!person) return <p>No user selected.</p>;

  return (
    <>
      {/* TITLE */}
      <TextComponent
        ComponentName={"UserPageTitle"}
        defaultText={"Make a page Title " + person.username}
        textMutable={false}
        editMode={false}
        settings={settings}
        setSettings={() => { }}
      />

      {/* BIO */}
      <TextComponent
        ComponentName={"UserBio"}
        defaultText={"Type your " + person.username + "Bio here..."}
        textMutable={false}
        editMode={false}
        settings={settings}
        setSettings={() => { }}
      />

      {/* BOOK LIST (no edit mode) */}
      <BookList
        books={books}
        editMode={false}
        settings={settings}
        deleteBook={() => { }}
        setBooks={() => { }}
        setSettings={() => { }}
      />
      <ul style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {books.map((book, i) => (
          <div
            key={book.isbn || i}
            style={{
              backgroundColor: "blue",
              padding: "5px",
              border: "2px solid black",
              borderRadius: "8px",
            }}
          >
            <li style={{ listStyle: "none" }}>
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                alt={`Book ${book.isbn}`}
              />
              <p>Title: {book.title}</p>
              <p>Author: {book.author}</p>
              <p>ISBN: {book.isbn}</p>
            </li>
          </div>
        ))}
      </ul>

      <SiteInfoFooter />
    </>
  );
}

export default PublicPage;