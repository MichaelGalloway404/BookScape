import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SiteInfoFooter from "../components/SiteInfoFooter";
import TextComponent from "../components/TextComponent";

function PublicPages() {
  const location = useLocation();
  const person = location.state?.user;
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [settings, setSettings] = useState({});
  const [pageBckColor, setPageBckColor] = useState("#c4ccd5");
  const [pageBckColor2, setPageBckColor2] = useState("#c4ccd5");
  const [gradientAngle, setGradientAngle] = useState(135);

  // Load user books and settings from the database
  useEffect(() => {
    if (!person) return;

    const loadPublicData = async () => {
      try {
        // ---------------- GET BOOKS ----------------
        const booksRes = await fetch(`/api/publicUserBooks?userId=${person.id}`);
        if (!booksRes.ok) throw new Error("Failed to fetch books");
        const booksData = await booksRes.json();

        // Normalize title and author
        const normalizedBooks = booksData.map(b => ({
          isbn: b.isbn,
          cover_id: b.cover_id,
          title: b.title?.main || b.title || "Unknown Title",
          author: Array.isArray(b.authors)
            ? b.authors.map(a => a.name).join(", ")
            : b.author || "Unknown Author"
        }));

        // Respect saved book order
        let orderedBooks = normalizedBooks;
        if (Array.isArray(person.book_order_json) && person.book_order_json.length > 0) {
          const orderMap = new Map(
            person.book_order_json.map((isbn, index) => [isbn, index])
          );
          orderedBooks = normalizedBooks.slice().sort((a, b) => {
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
        const settingsRes = await fetch(`/api/publicUserSettings?userId=${person.id}`);
        if (!settingsRes.ok) throw new Error("Failed to fetch settings");
        const settingsData = await settingsRes.json();
        setSettings(settingsData || {});
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    loadPublicData();
  }, [person, navigate]);

  // Apply main page background settings
  useEffect(() => {
    if (settings?.mainPage) {
      setPageBckColor(settings.mainPage.pageBckColor || "#c4ccd5");
      setPageBckColor2(settings.mainPage.pageBckColor2 || "#c4ccd5");
      setGradientAngle(settings.mainPage.gradientAngle || 135);
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

  if (!person) return <p>Loading user...</p>;

  // Book card settings from DB
  const bc = settings.bookCard || {};
  const gradient = bc.gradientAngle || 135;

  return (
    <>
      {/* PAGE TITLE */}
      <TextComponent
        ComponentName="UserPageTitle"
        defaultText={settings.UserPageTitle?.text || `${person.username}'s Page`}
        textMutable={false}
        editMode={false}
        settings={settings}
        setSettings={() => { }}
      />

      {/* USER BIO */}
      <TextComponent
        ComponentName="UserBio"
        defaultText={settings.UserBio?.text || person.bio || `${person.username} hasn't added a bio yet.`}
        textMutable={false}
        editMode={false}
        settings={settings}
        setSettings={() => { }}
      />

      {/* BOOK LIST */}
      {books.length === 0 ? (
        <p>No books added yet.</p>
      ) : (
        <ul style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {books.map((book, index) => (
            <div
              key={book.isbn || index}
              style={{
                background: `linear-gradient(${gradient}deg, ${bc.bgColor || "#fff"}, ${bc.bgColor2 || "#ccc"})`,
                padding: (bc.padding || 10) + "px",
                margin: (bc.margin || 5) + "px",
                border: `${bc.borderSize || 2}px ${bc.borderStyle || "solid"} ${bc.borderColor || "#000"}`,
                borderRadius: (bc.borderRadius || 5) + "px",
                maxWidth: "30%",
              }}
            >
              <li style={{ listStyle: "none" }}>
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                  alt={book.title}
                  style={{
                    width: (bc.cardImgWidth || 100) + "px",
                    border: `${bc.cardImgBorderSize || 2}px ${bc.cardImgBorderStyle || "solid"} ${bc.cardImgBorderColor || "#000"}`,
                    borderRadius: (bc.cardImgBorderRadius || 5) + "px",
                  }}
                />
                <p style={{
                  color: bc.titleColor || "#000",
                  fontSize: (bc.titleSize || 16) + "px",
                  margin: (bc.titleMargin || 0) + "px",
                  padding: (bc.titlePadding || 0) + "px",
                  width: (bc.titleWidth || "100%") + "px",
                }}>{book.title}</p>
                <p style={{
                  color: bc.authorColor || "#333",
                  fontSize: (bc.authorSize || 14) + "px",
                  margin: (bc.authorMargin || 0) + "px",
                  padding: (bc.authorPadding || 0) + "px",
                  width: (bc.authorWidth || "100%") + "px",
                }}>{book.author}</p>
              </li>
            </div>
          ))}
        </ul>
      )}

      <SiteInfoFooter />
    </>
  );
}

export default PublicPages;