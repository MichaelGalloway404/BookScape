export default async function handler(req, res) {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ error: "Missing userId" });
    }

    // Only for GET requests
    if (req.method === "GET") {
        try {
            const userCheck = await pool.query(
                `SELECT private FROM users WHERE id = $1`,
                [userId]
            );

            if (userCheck.rows.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            if (userCheck.rows[0].private) {
                return res.status(403).json({ error: "Profile is private" });
            }

            const result = await pool.query(
                `SELECT settings FROM user_settings WHERE user_id = $1`,
                [userId]
            );

            if (result.rows.length === 0) {
                return res.status(200).json({}); // no settings yet
            }

            return res.status(200).json(result.rows[0].settings);

        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}