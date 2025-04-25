import { Request, Response } from "express";
import knex from "../../db/constrants";
import sendResponse from "../../utils/api_response_handler";
import { asyncHandler } from "../../utils/asyncHandler";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Corrected import
import { createNotification } from "../../helper/commonHelper";

export const get_notifications = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // console.log("oifhoeiwh")
    const { user_id } = req.body;
    if (!user_id) {
      sendResponse({
        res,
        status: "error",
        data: null,
        message: "User ID is required",
        statusCode: 400,
      });
      return;
    }

    try {
      const notifications = await knex("notification")
        .select("id", "message", "type", "is_read", "createdAt")
        .where({
          user_id: Number(user_id),
          status: true, // Fetch only active notifications
        })
        .orderBy("createdAt", "desc");

      sendResponse({
        res,
        status: "success",
        data: notifications,
        message: "Notifications fetched successfully",
        statusCode: 200,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      sendResponse({
        res,
        status: "error",
        data: null,
        message: "Failed to fetch notifications",
        statusCode: 500,
      });
    }
  }
);

export const update_notification = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const {user_id } = req.body;

    if (!user_id) {
      sendResponse({
        res,
        status: "error",
        data: null,
        message: "Notification ID or User ID not provided",
        statusCode: 400,
      });
      return;
    }

    try {
      // Verify the notification belongs to the user
      const notification = await knex("notification")
        .where({
          user_id: Number(user_id),
        })
        .first();

      if (!notification) {
        sendResponse({
          res,
          status: "error",
          data: null,
          message: "Notification not found or access denied",
          statusCode: 404,
        });
        return;
      }

      // Soft delete by setting status to false
      const updatedCount = await knex("notification")
        .update({
          is_read: true,
          updatedAt: knex.fn.now(), // Explicitly update timestamp
        })
        .where({
          user_id: Number(user_id),
        });

      if (updatedCount === 0) {
        sendResponse({
          res,
          status: "error",
          data: null,
          message: "No changes made to the notification",
          statusCode: 400,
        });
        return;
      }

      sendResponse({
        res,
        status: "success",
        data: null,
        message: "Notification updated successfully",
        statusCode: 200,
      });
    } catch (error) {
      console.error("Error updating notification:", error);
      sendResponse({
        res,
        status: "error",
        data: null,
        message: "Failed to update notification",
        statusCode: 500,
      });
    }
  }
);