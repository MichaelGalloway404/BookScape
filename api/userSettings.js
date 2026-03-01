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
        `SELECT settings FROM user_settings WHERE user_id = $1`,
        [decoded.userId]
      );
      return res.status(200).json(result.rows[0] || { settings: [] });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
  }

  // POST: add/update settings
  if (req.method === "POST") {
    const { settings } = req.body;

    if (!settings) return res.status(400).json({ error: "No settings provided" });

    try {
      // insert or update
      await pool.query(
        `
        INSERT INTO user_settings (user_id, settings)
        VALUES ($1, $2)
        ON CONFLICT (user_id)
        DO UPDATE SET settings = EXCLUDED.settings
        `,
        [decoded.userId, settings]
      );

      return res.status(201).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}