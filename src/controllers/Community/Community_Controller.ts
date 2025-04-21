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
    const userInteraction = post.interactions.find((interaction) => interaction.userId === userId);
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
    data: transformedPosts,
  });
});

// Like a post
export const likePost = asyncHandler(async (req: Request, res: Response) => {
  const { userId, postId } = req.body;

  if (!userId || !postId) {
    return sendResponse({ res, status: "error", statusCode: 400, message: "userId and postId are required" });
  }

  const interaction = await prisma.postInteraction.upsert({
    where: { userId_postId: { userId, postId } },
    update: { liked: true, disliked: false },
    create: { userId, postId, liked: true, disliked: false },
  });

  sendResponse({ res, status: "success", statusCode: 200, message: "Post liked successfully", data: interaction });
});

// Dislike a post
export const dislikePost = asyncHandler(async (req: Request, res: Response) => {
  const { userId, postId } = req.body;

  if (!userId || !postId) {
    return sendResponse({ res, status: "error", statusCode: 400, message: "userId and postId are required" });
  }

  const interaction = await prisma.postInteraction.upsert({
    where: { userId_postId: { userId, postId } },
    update: { liked: false, disliked: true },
    create: { userId, postId, liked: false, disliked: true },
  });

  sendResponse({ res, status: "success", statusCode: 200, message: "Post disliked successfully", data: interaction });
});

// Remove like or dislike
export const removeInteraction = asyncHandler(async (req: Request, res: Response) => {
  const { userId, postId } = req.body;

  if (!userId || !postId) {
    return sendResponse({ res, status: "error", statusCode: 400, message: "userId and postId are required" });
  }

  const interaction = await prisma.postInteraction.update({
    where: { userId_postId: { userId, postId } },
    data: { liked: false, disliked: false },
  });

  sendResponse({ res, status: "success", statusCode: 200, message: "Interaction removed successfully", data: interaction });
});




export default {
  createPost,
  getPosts,
  likePost,
  dislikePost,
  removeInteraction,
};