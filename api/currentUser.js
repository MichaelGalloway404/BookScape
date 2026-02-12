import jwt from "jsonwebtoken";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "No token" });

  // GET: user info id, username, book_order
  if (req.method === "GET") {
    try {
      const secret = process.env.JWT_SECRET;
      const decoded = jwt.verify(token, secret);

      const result = await pool.query(
        "SELECT id, username, book_order FROM users WHERE id = $1",
        [decoded.userId]
      );

      if (!result.rows.length) return res.status(401).json({ error: "Invalid user" });
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(401).json({ error: "Invalid or expired token" });
    }
  }

  // POST: update book order preference
  if (req.method === "POST") {
    const { bookOrderPref } = req.body;

    try {
      await pool.query(
        `
      UPDATE users
      SET book_order = $1
      WHERE id = $2
      `,
        [bookOrderPref, decoded.userId]
      );

      return res.status(201).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
  }


  return res.status(405).json({ error: "Method not allowed" });
}
