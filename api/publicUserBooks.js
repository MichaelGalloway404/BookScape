import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  const { userId } = req.query; 

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  if (req.method === "GET") {
    try {
      const result = await pool.query(
        "SELECT isbn, cover_id FROM user_books WHERE user_id = $1",
        [userId]
      );

      return res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
