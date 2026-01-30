import { pool } from "@/lib/db";
import bcrypt from "bcrypt";

// API for creating a user
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  // add new user
  await pool.query(
    "INSERT INTO users (username, password_hash) VALUES ($1, $2)",
    [username, hash]
  );

  res.status(200).json({ ok: true });
}
