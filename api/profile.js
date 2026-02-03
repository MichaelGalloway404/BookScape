import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// API for simple user auth (protected)
export default async function handler(req, res) {
  // Example: simple auth using header token
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await pool.query(
      "SELECT id, username FROM users WHERE id = $1",
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Invalid user" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
