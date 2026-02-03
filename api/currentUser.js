import jwt from "jsonwebtoken";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    const result = await pool.query(
      "SELECT id, username FROM users WHERE id = $1",
      [decoded.userId]
    );

    if (!result.rows.length) return res.status(401).json({ error: "Invalid user" });

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
