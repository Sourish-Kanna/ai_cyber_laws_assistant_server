import express from "express";
import { PrismaClient } from "@prisma/client";
// import  app  from "./app";
import pool from "./db/index";  

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/users", async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

app.post("/users", async (req, res) => {
    const { name, email } = req.body;
    const newUser = await prisma.user.create({
    data: { name, email },
});
    res.json(newUser);
});

app.listen(PORT, async () => {
    try {
        await pool.query("SELECT NOW()");
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error("Database connection failed:", error);
    }
});


