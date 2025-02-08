import express from "express";
import  app  from "./app";
import pool from "./db/index";  
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.listen(PORT, async () => {
    try {
        await pool.query("SELECT NOW()");
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error("Database connection failed:", error);
    }
});


