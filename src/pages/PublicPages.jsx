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

  // Load public user data (books + settings)
  useEffect(() => {
    if (!person) return;

    const loadPublicData = async () => {
      try {
        // ---------------- GET BOOKS ----------------
        const booksRes = await fetch(`/api/publicUserBooks?userId=${person.id}`);
        if (!booksRes.ok) throw new Error("Failed to fetch books");
        const booksData = await booksRes.json();

        // Respect saved book order
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

  // Apply saved page background settings
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

  return (
    <>
      {/* PAGE TITLE */}
      <TextComponent
        ComponentName="UserPageTitle"
        defaultText={`Page Title: ${person.username}`}
        textMutable={false}
        editMode={false}
        settings={settings}
        setSettings={() => { }}
      />

      {/* USER BIO */}
      <TextComponent
        ComponentName="UserBio"
        defaultText={person.bio || `${person.username} hasn't added a bio yet.`}
        textMutable={false}
        editMode={false}
        settings={settings}
        setSettings={() => { }}
      />

      {/* USER BOOK LIST */}
      {books.length === 0 ? (
        <p>No books added yet.</p>
      ) : (
        <BookList
          books={books}
          editMode={false}
          settings={settings}
          deleteBook={() => { }}
          setBooks={() => { }}
          setSettings={() => { }}
        />
      )}

      <SiteInfoFooter />
    </>
  );
}

export default PublicPage; f