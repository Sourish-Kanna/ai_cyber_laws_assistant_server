import express from "express";
import { PrismaClient } from "@prisma/client";

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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
