import { Request, Response } from "express";
import knex from "../db/constrants";
import sendResponse from "../utils/api_response_handler";
import { asyncHandler } from "../utils/asyncHandler";

interface Notification {
  id: number;
  message: string;
  type: string;
  user_id: number;
  status: boolean;
  is_read: boolean;
  created_at: Date;
}

export const createNotification = async (
  message: string,
  type: string,
  userId: number,
  status: boolean = true
): Promise<Notification> => {
  try {
    const [notification] = await knex("notification")
      .insert({
        message,
        type,
        user_id: userId,
        status,
        is_read: false,
      })
      .returning("*");
    return notification;
  } catch (error) {
    console.log("Error creating notification:", error);
    throw error;
  }
};
