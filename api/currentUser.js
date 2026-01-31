import { Pool } from "pg";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET not set");
    }

    const payload = jwt.verify(token, secret);

    const result = await pool.query(
      "SELECT id, username FROM users WHERE id = $1",
      [payload.userId]
    );

    if (!result.rows.length) {
      return res.status(401).json({ error: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
}
