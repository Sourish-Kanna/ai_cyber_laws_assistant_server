import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }  // Comment this line for local development
    
});

pool.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err) => console.error("Database connection error:", err));

export default pool;
