import jwt from "jsonwebtoken";
import pool from "../lib/db";

export default async function handler(req, res) {
  // Extract JWT from HttpOnly cookie (set during login)
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "No token" });

  let decoded;
  try {
    // Verify the token's signature and expiration using the server secret
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // GET Route: Fetch current user's profile data
  if (req.method === "GET") {
    try {
      const result = await pool.query(
        "SELECT id, username, book_order_json, private FROM users WHERE id = $1",
        [decoded.userId] // Use ID from decoded token for security
      );
      if (!result.rows.length) return res.status(401).json({ error: "Invalid user" });
      return res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
  }

  // POST Route: Update profile settings (Book Preferences or Privacy)
  if (req.method === "POST") {
    const { bookOrderPref, privateStatus } = req.body;

    try {
      // Option 1: Update the user's custom book display order
      if (bookOrderPref) {
        if (!Array.isArray(bookOrderPref)) {
          return res.status(400).json({ error: "bookOrderPref must be an array" });
        }
        // Sanitize input: ensure all entries are strings (ISBNs)
        const cleanedIsbns = bookOrderPref.map(String);
        await pool.query(
          `UPDATE users SET book_order_json = $1 WHERE id = $2`,
          [JSON.stringify(cleanedIsbns), decoded.userId]
        );
        return res.status(201).json({ success: true, updated: "book_order" });
      }

      // Option 2: Toggle profile visibility (Public vs Private)
      if (privateStatus !== undefined) {
        if (typeof privateStatus !== "boolean") {
          return res.status(400).json({ error: "privateStatus must be boolean" });
        }
        await pool.query(
          `UPDATE users SET private = $1 WHERE id = $2`,
          [privateStatus, decoded.userId]
        );
        return res.status(201).json({ success: true, updated: "private" });
      }

      return res.status(400).json({ error: "No valid fields to update" });
    } catch (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
  }

  // Fallback for unsupported HTTP methods (e.g., PUT, DELETE)
  return res.status(405).json({ error: "Method not allowed" });
}
