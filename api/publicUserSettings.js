import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ error: "Missing userId" });
    }
    // GET: return user's settings
    if (req.method === "GET") {
        try {
            const result = await pool.query(
                `SELECT settings FROM user_settings WHERE user_id = $1`,
                [decoded.userId]
            );

            if (result.rows.length === 0) {
                return res.status(200).json({}); // no settings yet
            }

            // Return the entire JSON stored in the 'settings' column
            return res.status(200).json(result.rows[0].settings);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}