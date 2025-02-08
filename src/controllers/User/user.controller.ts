import { Request, Response } from "express";
import knex from "../../db/constrants"; // Make sure this path is correct

// Fetch all users
export const getAllUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await knex("User").select("*");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email } = req.body;
        // console.log(name)
        const existingUser = await knex("User").where({ email }).first();

        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const newUser = await knex("User").insert({ name, email }).returning("*");
        res.json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
};
