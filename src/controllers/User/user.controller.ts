import { Request, Response } from "express";
import knex from "../../db/constrants";
import sendResponse from "../../utils/api_response_handler";
import { asyncHandler } from "../../utils/asyncHandler";

export const getAllUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const users = await knex("User").select("*");
        res.json(users);
        sendResponse({
            res,
            status: "error",
            data: users,
            message: "User fetched successfully!",
            statusCode: 200,
        });
        return;
    }
);

export const createUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const { name, email } = req.body;
        // console.log(name)
        const existingUser = await knex("User").where({ email }).first();

        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const newUser = await knex("User")
            .insert({ name, email })
            .returning("*");
        sendResponse({
            res,
            status: "Created",
            data: newUser,
            message: "User created",
            statusCode: 201,
        });
    }
);

export const getUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        // Validate and parse the id parameter
        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
            sendResponse({
                res,
                status: "error",
                data: null,
                message: "Invalid user ID",
                statusCode: 400,
            });
            return;
        }

        // console.log(id)
        const user = await knex("User").where({user_id: id }).first();
        if (!user) {
            sendResponse({
                res,
                status: "error",
                data: null,
                message: "User not found",
                statusCode: 404,
            });
            return;
        }

        sendResponse({
            res,
            status: "success",
            data: user,
            message: "User data fetched successfully!",
            statusCode: 200,
        });
    }
);
