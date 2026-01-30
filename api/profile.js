import { pool } from "../lib/db";
import { authenticate } from "@/lib/auth";

// API  for simple user auth
export default async function handler(req, res) {
  authenticate(req, res, async () => {
    const result = await pool.query(
      "SELECT id, username FROM users WHERE id = $1",
      [req.userId]
    );

    res.status(200).json(result.rows[0]);
  });
}
