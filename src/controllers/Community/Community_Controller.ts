import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import sendResponse from "../../utils/api_response_handler";
import { asyncHandler } from "../../utils/asyncHandler";

const prisma = new PrismaClient();

// Create a new post
export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { content, authorId } = req.body;

  if (!content || !authorId) {
    return sendResponse({ res, status: "error", statusCode: 400, message: "Content and authorId are required" });
  }

  const newPost = await prisma.post.create({
    data: {
      content,
      authorId,
    },
  });

  sendResponse({ res, status: "success", statusCode: 201, message: "Post created successfully", data: newPost });
});

// Fetch all posts
export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.query.userId ? parseInt(req.query.userId as string, 10) : undefined;

  if (!userId) {
    return sendResponse({
      res,
      status: "error",
      statusCode: 400,
      message: "User ID is required",
    });
  }

  // Fetch the requesting user's details
  const requestingUser = await prisma.user.findUnique({
    where: { user_id: userId },
    select: { name: true },
  });

  if (!requestingUser) {
    return sendResponse({
      res,
      status: "error",
      statusCode: 404,
      message: "User not found",
    });
  }

  const posts = await prisma.post.findMany({
    include: {
      author: {
        select: {
          name: true, // Include author name
        },
      },
      interactions: true, // Include all interactions
    },
    orderBy: {
      createdAt: "asc", // Order posts by creation time
    },
  });

  // Transform the data into the required format
  const transformedPosts = posts.map((post) => {
    const userInteractions = post.interactions.filter(
      (interaction) => interaction.userId === userId
    );

    const userInteraction = userInteractions[0];

    return {
      id: post.id,
      content: post.content,
      author: post.author.name,
      likes: post.interactions.filter((interaction) => interaction.liked).length,
      dislikes: post.interactions.filter((interaction) => interaction.disliked).length,
      user_liked: userInteraction ? userInteraction.liked : false,
      user_disliked: userInteraction ? userInteraction.disliked : false,
    };
  });

  sendResponse({
    res,
    status: "success",
    statusCode: 200,
    message: "Posts fetched successfully",
    data: {
      requestingUser: requestingUser.name, // Include the requesting user's name
      posts: transformedPosts,
    },
  });
});

// Update interaction (like or dislike)
export const updateInteraction = asyncHandler(async (req: Request, res: Response) => {
  const { userId, postId, like, dislike } = req.body;

  if (!userId || !postId || (like === undefined && dislike === undefined)) {
    return sendResponse({ 
      res, 
      status: "error", 
      statusCode: 400, 
      message: "userId, postId, and either like or dislike are required" 
    });
  }

  if (like === true && dislike === true) {
    return sendResponse({ 
      res, 
      status: "error", 
      statusCode: 400, 
      message: "Both like and dislike cannot be true simultaneously" 
    });
  }

  const interaction = await prisma.postInteraction.upsert({
    where: { userId_postId: { userId, postId } },
    update: { liked: like === true, disliked: dislike === true },
    create: { userId, postId, liked: like === true, disliked: dislike === true },
  });

  sendResponse({ 
    res, 
    status: "success", 
    statusCode: 200, 
    message: "Interaction updated successfully", 
    data: interaction 
  });
});




export default {
  createPost,
  getPosts,
  updateInteraction,
};