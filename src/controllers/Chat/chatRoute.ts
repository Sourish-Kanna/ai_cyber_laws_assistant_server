import { Router } from "express";
import {
  get_chat_section,
  create_chat_section,
  delete_chat_section,
  get_all_chat_section,
} from "./chatController";

const router = Router();

router.get("/all", get_all_chat_section);
router.get("/:chat_section_id", get_chat_section);
router.get("/:chat_section_id", get_chat_section);
router.get("/", get_all_chat_section);
router.post("/create-chat-section", create_chat_section);
router.patch("/delete_chat_section", delete_chat_section);

export default router;
