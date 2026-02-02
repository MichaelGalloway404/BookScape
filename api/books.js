const { Pool } = require("pg");
const authenticate = require("./_middleware/auth");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  authenticate(req, res, async () => {
    const { isbn, cover_id } = req.body;
    const userId = req.userId;

    try {
      await pool.query(
        `
        INSERT INTO user_books (user_id, isbn, cover_id)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, isbn) DO NOTHING
        `,
        [userId, isbn, cover_id]
      );

      res.status(201).json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });
};
