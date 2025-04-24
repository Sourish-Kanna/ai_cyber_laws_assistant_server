import { Request, Response } from "express";
import knex from "../../db/constrants";
import sendResponse from "../../utils/api_response_handler";
import { asyncHandler } from "../../utils/asyncHandler";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Corrected import
import { createNotification } from "../../helper/commonHelper";

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
        user_id: Number(user_id),
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

    await createNotification("Chat Section Created successfully","",user_id,true)

    sendResponse({
      res,
      status: "success",
      data: create[0],
      message: "Chat created successfully !",
      statusCode: 201,
    });
  }
);

export const get_chat_section = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { user_id } = req.body;
    const { chat_section_id } = req.params;

    if (!user_id) {
      sendResponse({
        res,
        status: "error",
        data: null,
        message: "Chat section id or User Id not given !",
        statusCode: 400,
      });
      return;
    }

    const chat_section = await knex("chat_section")
      .select("*")
      .where({ user_id, chat_section_id });

    if (!chat_section) {
      sendResponse({
        res,
        status: "error",
        data: null,
        message: "Chat not found !",
        statusCode: 400,
      });
      return;
    }

    sendResponse({
      res,
      status: "success",
      data: chat_section,
      message: "Chat Section Fetched successfull !",
      statusCode: 200,
    });
  }
);

export const get_all_chat_section = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { user_id } = req.query;
    console.log(user_id)
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

    const all_chat_section = await knex("chat_section")
      .select("chat_section_id", "title", "createdAt", "updatedAt")
      .where({
        user_id: Number(user_id),
        status: true,
      })
      .orderBy([
        { column: "updatedAt", order: "desc" },
        { column: "createdAt", order: "desc" },
      ]); // Order by updatedAt first, then createdAt

    if (!all_chat_section) {
      sendResponse({
        res,
        status: "success",
        data: null,
        message: "No Chat section found !",
        statusCode: 200,
      });
      return;
    }

    sendResponse({
      res,
      status: "success",
      data: all_chat_section,
      message: "Chats Section fetched successfully !",
      statusCode: 200,
    });
    return;
  }
);

export const create_message = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { user_id, chat_section_id } = req.query;
    console.log(user_id,chat_section_id)
    if (!user_id || !chat_section_id) {
      sendResponse({
        res,
        status: "error",
        data: null,
        message: "User ID or Chat Section ID not provided",
        statusCode: 400,
      });
      return;
    }

    const { message,user_message } = req.body;

    if (!message) {
      sendResponse({
        res,
        status: "error",
        data: null,
        message: "Message content not provided",
        statusCode: 400,
      });
      return;
    }

    const existingChatSection = await knex("chat_section")
      .where({ chat_section_id: chat_section_id, user_id })
      .first();

    if (!existingChatSection) {
      sendResponse({
        res,
        status: "error",
        data: null,
        message: "Chat section not found or does not belong to the user",
        statusCode: 404,
      });
      return;
    }

    // Step 1: Store the question in the database with type QUESTION
    const newQuestion = await knex("Message")
      .insert({
        chat_section_id: chat_section_id,
        sender_id: user_id,
        content: user_message,
        type: "QUESTION",
      })
      .returning("*");

    if (newQuestion.length === 0) {
      sendResponse({
        res,
        status: "error",
        data: null,
        message: "Failed to store the question",
        statusCode: 400,
      });
      return;
    }

    // Step 2: Send the question to the DeepSeek API
    try {
      const api_code = process.env.GEMINI_API_KEY as string;
      const genAI = new GoogleGenerativeAI(api_code);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
      });

      const result = await model.generateContent(message);
      const responseContent = result.response.text();

      const newResponse = await knex("Message")
        .insert({
          chat_section_id: chat_section_id,
          sender_id: user_id,
          content: responseContent,
          type: "RESPONSE",
        })
        .returning("*");

      if (newResponse.length === 0) {
        sendResponse({
          res,
          status: "error",
          data: null,
          message: "Failed to store the response",
          statusCode: 400,
        });
        return;
      }

      // Step 4: Return the response to the frontend
      await createNotification(
        "Chat Created successfully",
        "",
        Number(user_id),
        true
      );
      sendResponse({
        res,
        status: "success",
        data: {
          question: newQuestion[0],
          response: newResponse[0],
        },
        message: "Message processed successfully",
        statusCode: 201,
      });
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      sendResponse({
        res,
        status: "error",
        data: null,
        message: "Failed to get response from Gemini API",
        statusCode: 500,
      });
    }
  }
);

export const get_Messages = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { chat_section_id, user_id } = req.query;

    if (!chat_section_id) {
      sendResponse({
        res,
        status: "error",
        data: null,
        message: "Chat Section ID not provided",
        statusCode: 400,
      });
      return;
    }

    const messages = await knex("Message")
      .select("*")
      .where({ chat_section_id, sender_id: user_id });

    if (!messages || messages.length === 0) {
      sendResponse({
        res,
        status: "success",
        data: [],
        message: "No messages found",
        statusCode: 200,
      });
      return;
    }

    sendResponse({
      res,
      status: "success",
      data: messages,
      message: "Messages fetched successfully",
      statusCode: 200,
    });
  }
);

export const delete_chat_section = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { chat_section_id, user_id } = req.body;
		console.log(chat_section_id);
		console.log('hell',user_id)

    const d = await knex("chat_section").update("status", 0).where({
      chat_section_id,
      user_id,
    });

		if (!d) {
      sendResponse({
        res,
        status: "error",
        data: null,
        message: "Chat Section not deleted",
        statusCode: 400,
      });
      return;
    }

    await createNotification(
      "Chat Section Deleted successfully",
      "",
      user_id,
      true
    );

		sendResponse({
			res,
			status: "success",
			data: null,
			message: "Chat Section deleted successfully!",
			statusCode: 201,
		});
		return;
  }
);
