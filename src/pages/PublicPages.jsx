import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import SiteInfoFooter from "../components/SiteInfoFooter";
import TextComponent from "../components/TextComponent";

function PublicPage() {
  const location = useLocation();
  const person = location.state?.user;

  const [books, setBooks] = useState([]);
  const [settings, setSettings] = useState({});
  const [pageBckColor, setPageBckColor] = useState("#c4ccd5");
  const [pageBckColor2, setPageBckColor2] = useState("#c4ccd5");
  const [gradientAngle, setGradientAngle] = useState(135);

  useEffect(() => {
    if (!person) return;

    const loadPublicData = async () => {
      try {
        // ---------------- GET BOOKS ----------------
        const booksRes = await fetch(`/api/publicUserBooks?userId=${person.id}`);
        if (!booksRes.ok) throw new Error("Failed to fetch books");
        const booksData = await booksRes.json();

        let orderedBooks = booksData;
        if (Array.isArray(person.book_order_json) && person.book_order_json.length > 0) {
          const orderMap = new Map(person.book_order_json.map((isbn, idx) => [isbn, idx]));
          orderedBooks = booksData.slice().sort((a, b) => {
            const aIdx = orderMap.get(a.isbn);
            const bIdx = orderMap.get(b.isbn);
            if (aIdx !== undefined && bIdx !== undefined) return aIdx - bIdx;
            if (aIdx !== undefined) return -1;
            if (bIdx !== undefined) return 1;
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
      }
    };

    loadPublicData();
  }, [person]);

  // Apply page background settings
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

  if (!person) return <p>No user selected.</p>;

  // ---------------- BOOK CARD STYLING FROM SETTINGS ----------------
  const bookCardSettings = settings.bookCard || {};
  const {
    bgColor = "#ffffff",
    bgColor2 = "#cccccc",
    borderSize = 2,
    borderColor = "#000",
    borderStyle = "solid",
    borderRadius = 8,
    padding = 10,
    margin = 5,
    gradientAngle: cardGradient = 135,
    cardImgWidth = 100,
    cardImgBorderSize = 2,
    cardImgBorderColor = "#000",
    cardImgBorderStyle = "solid",
    cardImgBorderRadius = 5,
    titleSize = 16,
    titleColor = "#000",
    titlePadding = 5,
    titleMargin = 2,
    titleWidth = 100,
    authorSize = 14,
    authorColor = "#333",
    authorPadding = 5,
    authorMargin = 2,
    authorWidth = 100,
  } = bookCardSettings;

  return (
    <>
      {/* TITLE */}
      <TextComponent
        ComponentName="UserPageTitle"
        defaultText={settings.UserPageTitle?.text || `Page Title: ${person.username}`}
        textMutable={false}
        editMode={false}
        settings={settings}
        setSettings={() => {}}
      />

      {/* BIO */}
      <TextComponent
        ComponentName="UserBio"
        defaultText={settings.UserBio?.text || person.bio || `${person.username} hasn't added a bio yet.`}
        textMutable={false}
        editMode={false}
        settings={settings}
        setSettings={() => {}}
      />

      {/* BOOK CARDS */}
      {books.length === 0 ? (
        <p>No books added yet.</p>
      ) : (
        <ul
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            padding: 0,
            margin: 0,
            listStyle: "none",
          }}
        >
          {books.map((book, idx) => (
            <li
              key={book.isbn || idx}
              style={{
                background: `linear-gradient(${cardGradient}deg, ${bgColor}, ${bgColor2})`,
                padding: padding,
                margin: margin,
                border: `${borderSize}px ${borderStyle} ${borderColor}`,
                borderRadius: borderRadius,
                maxWidth: "30%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                alt={book.title}
                style={{
                  width: cardImgWidth,
                  border: `${cardImgBorderSize}px ${cardImgBorderStyle} ${cardImgBorderColor}`,
                  borderRadius: cardImgBorderRadius,
                  marginBottom: 5,
                }}
              />
              <p
                style={{
                  fontSize: titleSize,
                  color: titleColor,
                  padding: titlePadding,
                  margin: titleMargin,
                  width: titleWidth,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {book.title}
              </p>
              <p
                style={{
                  fontSize: authorSize,
                  color: authorColor,
                  padding: authorPadding,
                  margin: authorMargin,
                  width: authorWidth,
                  textAlign: "center",
                }}
              >
                {book.author}
              </p>
            </li>
          ))}
        </ul>
      )}

      <SiteInfoFooter />
    </>
  );
}

export default PublicPage;