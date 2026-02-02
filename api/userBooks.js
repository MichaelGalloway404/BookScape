import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get books for the currently logged-in user
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // same auth pattern you already use
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await pool.query(
      `
      SELECT id, isbn, cover_id
      FROM user_books
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
