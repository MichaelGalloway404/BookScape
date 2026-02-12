import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  // GET: public users info with books
  if (req.method === "GET") {
    try {
      // Get all public users
      const usersResult = await pool.query(
        "SELECT id, username, book_order_json FROM users WHERE private = FALSE"
      );

      const users = usersResult.rows;

      // For each user, get their books
      const usersWithBooks = await Promise.all(
        users.map(async (user) => {
          const booksResult = await pool.query(
            `
            SELECT isbn, cover_id
            FROM user_books
            WHERE user_id = $1
            `,
            [user.id]
          );

          // Map books to respect book_order_json if present
          let books = booksResult.rows;

          if (Array.isArray(user.book_order_json) && user.book_order_json.length > 0) {
            const orderMap = new Map(user.book_order_json.map((isbn, index) => [isbn, index]));
            books = books.slice().sort((a, b) => {
              const aIndex = orderMap.get(a.isbn);
              const bIndex = orderMap.get(b.isbn);
              if (aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex;
              if (aIndex !== undefined) return -1;
              if (bIndex !== undefined) return 1;
              return 0;
            });
          }

          return { ...user, books };
        })
      );

      return res.status(200).json(usersWithBooks);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
