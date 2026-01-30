import { pool } from "../lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// secure API for logging in a user
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  // check db for user
  const result = await pool.query(
    "SELECT id, password_hash FROM users WHERE username = $1",
    [username]
  );

  if (!result.rows.length) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);

  // check password
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // return auth token
  res.status(200).json({ token });
}
