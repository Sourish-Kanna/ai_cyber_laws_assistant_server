import { Router } from "express";
import CommunityController from "./Community_Controller";

const router = Router();

router.post("/create", CommunityController.createPost);
router.get("/posts", CommunityController.getPosts);
router.post("/like", CommunityController.likePost);
router.post("/dislike", CommunityController.dislikePost);
router.post("/remove-interaction", CommunityController.removeInteraction);

export default router;
