import jwt from "jsonwebtoken";
import pool from "../lib/db";

export default async function handler(req, res) {
    // Authentication check: Retrieve the token from HttpOnly cookies
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "No token" });

    let decoded;
    try {
        // Verify token and extract the userId payload
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }

    // GET: Retrieve the personal library of the authenticated user
    if (req.method === "GET") {
        try {
            const result = await pool.query(
                `
                SELECT isbn, cover_id, title, author
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

    // POST: Add a new book to the user's personal collection
    if (req.method === "POST") {
        const { isbn, cover_id, title, author } = req.body;

        try {
            await pool.query(
                `
                INSERT INTO user_books (user_id, isbn, cover_id, title, author)
                VALUES ($1, $2, $3, $4, $5)
                `,
                [decoded.userId, isbn, cover_id, title, author]
            );

            return res.status(201).json({ success: true });
        } catch (err) {
            // PostgreSQL code 23505: Unique violation 
            // (Assumes a unique constraint on user_id + isbn)
            if (err.code === "23505") {
                return res.status(409).json({ error: "Book already added" });
            }

            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
    }

    // DELETE: Remove a book from the user's library
    if (req.method === "DELETE") {
        const { isbn, cover_id } = req.body;

        try {
            // Explicitly checking user_id ensures users can only delete their own data
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

    // Handle any HTTP methods not explicitly defined above
    return res.status(405).json({ error: "Method not allowed" });
}
