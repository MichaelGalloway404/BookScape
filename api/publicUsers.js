import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {

  // GET: user info
  if (req.method === "GET") {
    try {
      const result = await pool.query(
        "SELECT username, book_order_json FROM users WHERE private = TRUE"
      );
      return res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
