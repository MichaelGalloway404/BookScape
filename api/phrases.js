import { Pool } from "pg"; // PostgreSQL tools, and Pool manages a pool of database connections
// Instead of opening a new DB connection every request

// Keep DB credentials out of code
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Next.js / serverless setup, runs every time a request hits this endpoint
export default async function handler(req, res) {
  // client is asking for data
  if (req.method === "GET") {
    try {
      const result = await pool.query("SELECT name, phrase FROM phrases ORDER BY id DESC");
      // send back the querry, 200 ok, and client gets data [{"name":name, "phrase":phrase},{},...] newest entries 1st
      res.status(200).json(result.rows); 
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Database error" });
    }
  } 
  // client sends data 
  else if (req.method === "POST") {
    const { name, phrase } = req.body; // exstract data
    try {
      await pool.query("INSERT INTO phrases (name, phrase) VALUES ($1, $2)", [name, phrase]);
      res.status(200).json({ ok: true }); // worked
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Database error" });
    }
  } 
  // 
  else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
