import express from "express";
import app from "./app";
import pool from "./db/index";
import dotenv from "dotenv";
const PORT = process.env.PORT;

dotenv.config({
    path: "./.env",
});

app.use(express.json());

app.listen(PORT, async () => {
    try {
        await pool.query("SELECT NOW()");
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error("Error while connecting to the database:", error);
    }
});
