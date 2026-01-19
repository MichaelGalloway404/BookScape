import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const result = await pool.query("SELECT name, phrase FROM phrases ORDER BY id DESC");
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Database error" });
    }
  } else if (req.method === "POST") {
    const { name, phrase } = req.body;
    try {
      await pool.query("INSERT INTO phrases (name, phrase) VALUES ($1, $2)", [name, phrase]);
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Database error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
