import jwt from "jsonwebtoken";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ error: "No token" });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }

    // GET: return user's books
    if (req.method === "GET") {
        try {
            const result = await pool.query(
                `
        SELECT isbn, cover_id, created_at
        FROM user_books
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
                [decoded.userId]
            );

            return res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
    }

    // POST: add book (already working)
    if (req.method === "POST") {
        const { isbn, cover_id } = req.body;

        try {
            await pool.query(
                `
        INSERT INTO user_books (user_id, isbn, cover_id)
        VALUES ($1, $2, $3)
        `,
                [decoded.userId, isbn, cover_id]
            );

            return res.status(201).json({ success: true });
        } catch (err) {
            if (err.code === "23505") {
                return res.status(409).json({ error: "Book already added" });
            }

            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
