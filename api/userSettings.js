import jwt from "jsonwebtoken";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "No token" });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }

  // GET: return user's settings
  if (req.method === "GET") {
    try {
      const result = await pool.query(
        `SELECT book_card FROM user_settings WHERE user_id = $1`,
        [decoded.userId]
      );
      return res.status(200).json(result.rows[0] || { book_card: [] });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
  }

  // POST: add/update settings
  if (req.method === "POST") {
    const { book_card } = req.body;

    if (!book_card) return res.status(400).json({ error: "No book_card provided" });

    try {
      // insert or update
      await pool.query(
        `
        INSERT INTO user_settings (user_id, book_card)
        VALUES ($1, $2)
        ON CONFLICT (user_id)
        DO UPDATE SET book_card = EXCLUDED.book_card
        `,
        [decoded.userId, book_card]
      );

      return res.status(201).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}