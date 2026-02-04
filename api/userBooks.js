import jwt from "jsonwebtoken";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  const { isbn, cover_id } = req.body;

  if (!isbn && !cover_id) {
    return res.status(400).json({ error: "Missing book data" });
  }

  try {
    await pool.query(
      `
      INSERT INTO user_books (user_id, isbn, cover_id)
      VALUES ($1, $2, $3)
      `,
      [decoded.userId, isbn, cover_id]
    );

    return res.status(201).json({ success: true });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Book already added" });
    }

    console.error(err);
    return res.status(500).json({ error: "Database error" });
  }
}
