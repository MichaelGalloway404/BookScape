import jwt from "jsonwebtoken";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) return res.status(401).json({ error: "No token" });

    const token = cookie
      .split("; ")
      .find(row => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) return res.status(401).json({ error: "Missing token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      "SELECT id, username FROM users WHERE id = $1",
      [decoded.userId]
    );

    if (!result.rows.length) return res.status(401).json({ error: "User not found" });

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
