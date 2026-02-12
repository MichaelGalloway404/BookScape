import jwt from "jsonwebtoken";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "No token" });

    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // GET: return user's books
    if (req.method === "GET") {
        try {
            const result = await pool.query(
                `
        SELECT isbn, cover_id
        FROM user_books
        WHERE user_id = $1
        `,
                [decoded.userId]
            );

            return res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
    }

    // POST: add book 
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

    // POST: remove book 
    if (req.method === "DELETE") {
        const { isbn, cover_id } = req.body;

        try {
            await pool.query(
                `
      DELETE FROM user_books
      WHERE user_id = $1
        AND isbn = $2
        AND cover_id = $3
      `,
                [decoded.userId, isbn, cover_id]
            );

            return res.status(200).json({ success: true });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
