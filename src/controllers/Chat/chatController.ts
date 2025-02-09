import { Request, Response } from "express";
import knex from "../../db/constrants";
import sendResponse from "../../utils/api_response_handler";
import { asyncHandler } from "../../utils/asyncHandler";

export const create_chat_section = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const { user_id, title } = req.body;

        const chatTitle = title || "New Chat";

        if (!user_id) {
            sendResponse({
                res,
                status: "error",
                data: null,
                message: "User Id not given",
                statusCode: 400,
            });
            return;
        }

        const existingUser = await knex("User").where({ user_id }).first();

        if (!existingUser) {
            sendResponse({
                res,
                status: "error",
                data: null,
                message: "User Id not found",
                statusCode: 404,
            });
            return;
        }

        const create = await knex("chat_section")
            .insert({
                user_id,
                title: chatTitle,
            })
            .returning("chat_section_id");

        if (create.length === 0) {
            sendResponse({
                res,
                status: "error",
                data: null,
                message: "Chat not created",
                statusCode: 400,
            });
            return;
        }

        sendResponse({
            res,
            status: "success",
            data: create,
            message: "Chat created successfully !",
            statusCode: 201,
        });
    }
);

export const create_chat_question = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {}
);

export const create_chat_response = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {}
);

export const get_chat_section = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {}
);

export const get_all_chat_section = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {}
);

export const get_chat_question = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {}
);

export const get_chat_response = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {}
);

export const delete_chat_section = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {}
);
