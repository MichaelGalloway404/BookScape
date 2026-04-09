import pool from "../lib/db";

export default async function handler(req, res) {
    // Extracts userId from the URL query string (e.g., /api/settings?userId=123)
    const { userId } = req.query;

    // Validation: ensures a target user is specified
    if (!userId) {
        return res.status(400).json({ error: "Missing userId" });
    }

    // Public GET Route: Allows fetching a user's settings by their ID
    if (req.method === "GET") {
        try {
            const result = await pool.query(
                `SELECT settings FROM user_settings WHERE user_id = $1`,
                [userId] // Uses parameterized query to prevent SQL injection
            );

            // If no settings found for this ID, return an empty object
            if (result.rows.length === 0) {
                return res.status(200).json({});
            }

            // Return the raw JSON settings object stored in the database
            return res.status(200).json(result.rows[0].settings);
        } catch (err) {
            // Logs error server-side for debugging
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
    }

    // Restriction: Only GET is allowed here; updates should happen in a protected route
    return res.status(405).json({ error: "Method not allowed" });
}
