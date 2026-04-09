import pool from "../lib/db";


export default async function handler(req, res) {
  // Extracts userId from the URL query parameters (e.g., /api/books?userId=123)
  const { userId } = req.query;

  // Validation: ensures the request actually specified which user's books to fetch
  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  // Only handle GET requests for fetching data
  if (req.method === "GET") {
    try {
      /**
       * Fetches the book collection for a specific user.
       * Note: This endpoint is "Public"—it does not currently check if the 
       * requesting user has permission to see this specific userId's books.
       */
      const result = await pool.query(
        "SELECT isbn, cover_id, title, author FROM user_books WHERE user_id = $1",
        [userId] // Parameterized to prevent SQL injection
      );

      // Returns an array of book objects (empty array if user has no books)
      return res.status(200).json(result.rows);
    } catch (err) {
      // Log the specific error for server-side debugging
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
  }

  // Standard response for unsupported methods (POST, DELETE, etc.)
  return res.status(405).json({ error: "Method not allowed" });
}
