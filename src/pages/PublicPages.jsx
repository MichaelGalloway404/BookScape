// React hooks for state and lifecycle
import { useEffect, useState } from "react";

// React Router hooks for navigation and accessing route data
import { useNavigate, useLocation } from "react-router-dom";

// Custom components
import SiteInfoFooter from "../components/SiteInfoFooter";
import TextComponent from "../components/TextComponent";

// CSS module for styling (scoped styles)
import style from "./PublicPages.module.css"

function PublicPages() {

  // Get current route info (used to access passed-in user data)
  const location = useLocation();

  // Extract user (person) from navigation state
  const person = location.state?.user;

  // Hook for programmatic navigation (redirects)
  const navigate = useNavigate();

  // ---------------- STATE ----------------

  // Stores list of books for this user
  const [books, setBooks] = useState([]);

  // Stores all UI settings fetched from DB
  const [settings, setSettings] = useState({});

  // Page background colors + gradient angle
  const [pageBckColor, setPageBckColor] = useState("#c4ccd5");
  const [pageBckColor2, setPageBckColor2] = useState("#c4ccd5");
  const [gradientAngle, setGradientAngle] = useState(0);

  // Loading state (used to show spinner)
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH USER DATA ----------------
  useEffect(() => {
    // If no user, don't run
    if (!person) return;

    const loadPublicData = async () => {
      try {

        // ---------- FETCH BOOKS ----------
        const booksRes = await fetch(`/api/publicUserBooks?userId=${person.id}`);
        if (!booksRes.ok) throw new Error("Failed to fetch books");

        const booksData = await booksRes.json();

        // Normalize book data structure (API may vary)
        const normalizedBooks = booksData.map(b => ({
          isbn: b.isbn,
          cover_id: b.cover_id,

          // Handle different title formats
          title: b.title?.main || b.title || "Unknown Title",

          // Handle multiple authors OR single author
          author: Array.isArray(b.authors)
            ? b.authors.map(a => a.name).join(", ")
            : b.author || "Unknown Author"
        }));

        // ---------- ORDER BOOKS ----------
        let orderedBooks = normalizedBooks;

        // If user has saved book order, apply it
        if (Array.isArray(person.book_order_json) && person.book_order_json.length > 0) {

          // Map ISBN → index for sorting
          const orderMap = new Map(
            person.book_order_json.map((isbn, index) => [isbn, index])
          );

          // Sort books based on saved order
          orderedBooks = normalizedBooks.slice().sort((a, b) => {
            const aIndex = orderMap.get(a.isbn);
            const bIndex = orderMap.get(b.isbn);

            if (aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex;
            if (aIndex !== undefined) return -1;
            if (bIndex !== undefined) return 1;

            return 0;
          });
        }

        // Save books to state
        setBooks(orderedBooks);

        // ---------- FETCH SETTINGS ----------
        const settingsRes = await fetch(`/api/publicUserSettings?userId=${person.id}`);
        if (!settingsRes.ok) throw new Error("Failed to fetch settings");

        const settingsData = await settingsRes.json();

        // Save settings (or empty object fallback)
        setSettings(settingsData || {});

        // Done loading
        setLoading(false);

      } catch (err) {
        console.error(err);

        // Redirect to login on error
        navigate("/login");
      }
    };

    // Run async function
    loadPublicData();

  }, [person, navigate]);

  // ---------------- APPLY PAGE BACKGROUND SETTINGS ----------------
  useEffect(() => {
    if (settings?.mainPage) {
      setPageBckColor(settings.mainPage.pageBckColor || "#c4ccd5");
      setPageBckColor2(settings.mainPage.pageBckColor2 || "#c4ccd5");
      setGradientAngle(settings.mainPage.gradientAngle || 0);
    }
  }, [settings]);

  // ---------------- APPLY BACKGROUND TO BODY ----------------
  useEffect(() => {

    // Save original background
    const originalBackground = document.body.style.background;

    // Apply gradient background
    document.body.style.background =
      `linear-gradient(${gradientAngle}deg, ${pageBckColor}, ${pageBckColor2})`;

    // Cleanup: restore original background when component unmounts
    return () => {
      document.body.style.background = originalBackground;
    };

  }, [pageBckColor, pageBckColor2, gradientAngle]);

  // If no user yet
  if (!person) return <p>Loading user...</p>;

  // ---------------- SETTINGS SHORTCUTS ----------------

  // Book card settings
  const bc = settings.bookCard || {};

  // Gradient angle for book cards
  const gradient = bc.gradientAngle || 0;

  // Main page settings
  const mainPage = settings.mainPage || {};

  // ---------------- LOADING SCREEN ----------------
  if (!person || loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>Loading page...</p>
        <div className={style.spinner}></div>
      </div>
    );
  }

  // ---------------- MAIN RENDER ----------------
  return (
    <div
      style={{
        // Conditional background gradient
        background: (
          (mainPage.mainDivBckGrndOn === true || mainPage.mainDivBckGrndOn === "true")
            ? `linear-gradient(${mainPage.mainDivGradientAngle ?? 0}deg, 
              ${mainPage.mainDivBGColor ?? "#ffffff"}, 
              ${mainPage.mainDivBGColor2 ?? "#dddddd"})`
            : "none"
        ),

        // Layout styling from settings
        padding: (mainPage.mainDivPadding ?? 0) + "px",
        border: `${mainPage.mainDivBorderSize ?? 0}px 
                 ${mainPage.mainDivBorderStyle ?? "solid"} 
                 ${mainPage.mainDivBorderColor ?? "transparent"}`,
        borderRadius: (mainPage.mainDivBorderRadius ?? 0) + "px",

        marginLeft: (mainPage.mainDivMarginLeft ?? 0) + "px",
        marginRight: (mainPage.mainDivMarginRight ?? 0) + "px",
        marginTop: (mainPage.mainDivMarginTop ?? 0) + "px",
        marginBottom: (mainPage.mainDivMarginBottom ?? 0) + "px",
      }}
    >

      {/* -------- PAGE TITLE -------- */}
      <TextComponent
        ComponentName="UserPageTitle"
        defaultText={settings.UserPageTitle?.text || `${person.username}'s Page`}
        textMutable={false}
        editMode={false}
        settings={settings}
        setSettings={() => { }}
      />

      {/* -------- USER BIO -------- */}
      <TextComponent
        ComponentName="UserBio"
        defaultText={
          settings.UserBio?.text ||
          person.bio ||
          `${person.username} hasn't added a bio yet.`
        }
        textMutable={false}
        editMode={false}
        settings={settings}
        setSettings={() => { }}
      />

      {/* -------- BOOK LIST -------- */}
      {books.length === 0 ? (
        <p>No books added yet.</p>
      ) : (
        <div
          style={{
            // Optional background for book list section
            background: (
              (mainPage.bookListDivBckGrndOn === true || mainPage.bookListDivBckGrndOn === "true")
                ? `linear-gradient(${mainPage.bookListDivGradientAngle ?? 0}deg, 
                  ${mainPage.bookListDivBGColor ?? "#ffffff"},
                  ${mainPage.bookListDivBGColor2 ?? "#ffffff"})`
                : "none"
            ),

            border: `${mainPage.bookListDivBorderSize ?? 0}px 
                     ${mainPage.bookListDivBorderStyle ?? "none"} 
                     ${mainPage.bookListDivBorderColor ?? "#ffffff"}`,

            borderRadius: (mainPage.bookListDivBorderRadius ?? 0) + "px",

            // Margins + padding
            marginLeft: (mainPage.bookListDivMarginLeft ?? 0) + "px",
            marginRight: (mainPage.bookListDivMarginRight ?? 0) + "px",
            marginTop: (mainPage.bookListDivMarginTop ?? 0) + "px",
            marginBottom: (mainPage.bookListDivMarginBottom ?? 0) + "px",

            paddingLeft: (mainPage.bookListDivPaddingLeft ?? 0) + "px",
            paddingRight: (mainPage.bookListDivPaddingRight ?? 0) + "px",
            paddingTop: (mainPage.bookListDivPaddingTop ?? 0) + "px",
            paddingBottom: (mainPage.bookListDivPaddingBottom ?? 0) + "px",
          }}
        >

          {/* Book grid */}
          <ul style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {books.map((book, index) => (
              <div
                key={book.isbn || index}
                style={{
                  // Book card background
                  background: (
                    (bc.backgroundOn === true || bc.backgroundOn === "true")
                      ? `linear-gradient(${gradient}deg, ${bc.bgColor || "#fff"}, ${bc.bgColor2 || "#ccc"})`
                      : "none"
                  ),

                  padding: (bc.padding || 0) + "px",
                  margin: (bc.margin || 0) + "px",

                  border: `${bc.borderSize || 0}px 
                           ${bc.borderStyle || "solid"} 
                           ${bc.borderColor || "#000"}`,

                  borderRadius: (bc.borderRadius || 0) + "px",
                  maxWidth: "30%",
                }}
              >
                <li style={{ listStyle: "none" }}>

                  {/* Book cover image */}
                  <img
                    src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                    alt={book.title}
                    style={{
                      width: (bc.cardImgWidth || 0) + "px",
                      border: `${bc.cardImgBorderSize || 0}px 
                               ${bc.cardImgBorderStyle || "solid"} 
                               ${bc.cardImgBorderColor || "#000"}`,
                      borderRadius: (bc.cardImgBorderRadius || 0) + "px",
                    }}
                  />

                  {/* Book title */}
                  <p style={{
                    color: bc.titleColor || "#000",
                    fontSize: (bc.titleSize || 0) + "px",
                    margin: (bc.titleMargin || 0) + "px",
                    padding: (bc.titlePadding || 0) + "px",
                    width: (bc.titleWidth || "100%") + "px",
                    fontFamily: (bc.titleFontFamily || "Arial"),
                  }}>
                    {book.title}
                  </p>

                  {/* Book author */}
                  <p style={{
                    color: bc.authorColor || "#333",
                    fontSize: (bc.authorSize || 0) + "px",
                    margin: (bc.authorMargin || 0) + "px",
                    padding: (bc.authorPadding || 0) + "px",
                    width: (bc.authorWidth || "100%") + "px",
                    fontFamily: (bc.authorFontFamily || "Arial"),
                  }}>
                    {book.author}
                  </p>

                </li>
              </div>
            ))}
          </ul>
        </div>
      )}

      {/* -------- USER QUOTES -------- */}
      {settings?.mainPage?.userQuotes?.map((quoteKey) => (
        <TextComponent
          key={quoteKey}
          ComponentName={quoteKey}
          defaultText="Type something"
          textMutable={false}
          editMode={false}
          settings={settings}
          setSettings={() => { }}
        />
      ))}

      {/* -------- FOOTER -------- */}
      <SiteInfoFooter />

    </div>
  );
}

export default PublicPages;