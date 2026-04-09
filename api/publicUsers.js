import pool from "../lib/db";

export default async function handler(req, res) {
  // Public route to browse users: only allows GET requests
  if (req.method === "GET") {
    try {
      /**
       * Fetches all users who have explicitly set their profile to public.
       * - Returns: id (for linking), username (display name), and book_order_json (custom sorting).
       * - Privacy: The 'WHERE private = FALSE' clause ensures hidden profiles are never leaked.
       */
      const result = await pool.query(
        "SELECT id, username, book_order_json FROM users WHERE private = FALSE"
      );

      // Return the array of public user objects
      return res.status(200).json(result.rows); 
    } catch (err) {
      // Standard server-side error logging
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
  }

  // Block any attempts to POST, PUT, or DELETE to this list
  return res.status(405).json({ error: "Method not allowed" });
}
