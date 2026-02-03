const { Pool } = require("pg");
const authenticate = require("./_middleware/auth");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  authenticate(req, res, async () => {
    try {
      const result = await pool.query(
        `
        SELECT id, isbn, cover_id
        FROM user_books
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
        [req.userId]
      );

      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });
};
