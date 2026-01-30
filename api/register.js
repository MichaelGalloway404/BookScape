import { pool } from "@/lib/db";
import bcrypt from "bcrypt";

// API for creating a user
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2)",
      [username, hash]
    );

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);

    // PostgreSQL duplicate key error code for UNIQUE constraint
    if (err.code === "23505") {
      return res.status(409).json({ error: "Username already exists" });
    }

    res.status(500).json({ error: "Server error" });
  }
}
