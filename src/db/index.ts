import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err) => console.error("Database connection error:", err));

export default pool;
