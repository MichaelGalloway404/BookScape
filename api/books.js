import { Pool } from "pg";

const userId = Number(req.headers["x-user-id"]);

if (!userId || Number.isNaN(userId)) {
  return res.status(401).json({ error: "Unauthorized" });
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = req.headers["x-user-id"]; // or decoded JWT later
  const { isbn, cover_id } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await pool.query(
      `INSERT INTO user_books (user_id, isbn, cover_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, isbn) DO NOTHING`,
      [userId, isbn, cover_id]
    );

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
