import jwt from "jsonwebtoken";
import pool from "../lib/db";

export default async function handler(req, res) {
  // Authentication: Extract token from cookies
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "No token" });

  let decoded;
  try {
    // Validate the token and extract the userId
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }

  // GET: Fetch the JSON settings object for the authenticated user
  if (req.method === "GET") {
    try {
      const result = await pool.query(
        `SELECT settings FROM user_settings WHERE user_id = $1`,
        [decoded.userId]
      );

      // If user hasn't saved settings yet, return an empty object instead of an error
      if (result.rows.length === 0) {
        return res.status(200).json({}); 
      }

      // Return only the contents of the 'settings' JSONB column
      return res.status(200).json(result.rows[0].settings);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
  }

  // POST: Save or update the user's settings
  if (req.method === "POST") {
    const settings = req.body; // Expects a JSON object

    // Prevent saving empty data
    if (!settings || Object.keys(settings).length === 0) {
      return res.status(400).json({ error: "No settings provided" });
    }

    try {
      /**
       * UPSERT Logic:
       * - Tries to INSERT a new settings row.
       * - If user_id already exists (ON CONFLICT), it UPDATES the existing row.
       * - EXCLUDED.settings refers to the new value we tried to insert.
       */
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

  // Fallback for unsupported HTTP methods
  return res.status(405).json({ error: "Method not allowed" });
}
