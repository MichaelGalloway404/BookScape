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
    console.error(err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // GET: user info
  if (req.method === "GET") {
    try {
      const result = await pool.query(
        "SELECT id, username, book_order_json FROM users WHERE id = $1",
        [decoded.userId]
      );
      if (!result.rows.length) return res.status(401).json({ error: "Invalid user" });
      return res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
  }

  // POST: profile needs
  if (req.method === "POST") {
    const { bookOrderPref, privateStatus } = req.body; // privateStatus expected as true/false

    try {
      if (bookOrderPref) {
        // Update book order
        if (!Array.isArray(bookOrderPref)) {
          return res.status(400).json({ error: "bookOrderPref must be an array" });
        }
        const cleanedIsbns = bookOrderPref.map(String);
        await pool.query(
          `UPDATE users SET book_order_json = $1 WHERE id = $2`,
          [JSON.stringify(cleanedIsbns), decoded.userId]
        );
        return res.status(201).json({ success: true, updated: "book_order" });
      }

      if (privateStatus !== undefined) {
        // Update private flag
        if (typeof privateStatus !== "boolean") {
          return res.status(400).json({ error: "privateStatus must be boolean" });
        }
        await pool.query(
          `UPDATE users SET private = $1 WHERE id = $2`,
          [privateStatus, decoded.userId]
        );
        return res.status(201).json({ success: true, updated: "private" });
      }

      // If neither provided
      return res.status(400).json({ error: "No valid fields to update" });
    } catch (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
  }


  return res.status(405).json({ error: "Method not allowed" });
}
