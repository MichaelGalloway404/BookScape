import pool from "../lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // Only allow POST requests for login to protect credentials
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  // Basic validation to ensure required fields are present
  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  try {
    // Fetch user record; uses parameterized query ($1) to prevent SQL Injection
    const result = await pool.query(
      "SELECT id, password_hash FROM users WHERE username = $1",
      [username]
    );

    // Return generic error if user not found
    if (!result.rows.length) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    // Securely compare the provided password with the hashed version in DB
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not set in environment variables");
    }

    // Generate a signed JWT containing the user's unique ID
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "1h" });

    /**
     * Security Headers for Cookie:
     * - HttpOnly: Prevents client-side JS from accessing the token (mitigates XSS)
     * - Path=/: Available across the entire site
     * - SameSite=Strict: Prevents cookie from being sent in cross-site requests (mitigates CSRF)
     * - Secure: Ensures cookie is only sent over HTTPS
     */
    res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict; Secure`);

    // Success response; minimal data returned to client
    res.status(200).json({ ok: true });
  } catch (err) {
    // Log error for server-side debugging 
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
