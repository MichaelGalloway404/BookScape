import { Pool } from "pg";

/**
 * In Next.js (development), global variables are preserved between hot reloads.
 * Prevents app from creating a new pool every time you save a file.
 */
let pool;

if (!global._postgresPool) {
  global._postgresPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // limit to how many connections one pool can hold
    max: 20, 
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
}

pool = global._postgresPool;

export default pool;
