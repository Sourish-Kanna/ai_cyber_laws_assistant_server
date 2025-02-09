import { Router } from "express";
import {
  get_chat_question,
  get_chat_section,
  create_chat_response,
  create_chat_question,
  create_chat_section,
  delete_chat_section,
  get_chat_response,
  get_all_chat_section,
} from "./chatController";

const router = Router();

router.get("/all", get_all_chat_section);
router.get("/:chat_section_id", get_chat_section);
router.post("/create-chat-section", create_chat_section);
router.post("/create-chat-question", create_chat_question);
router.post("/create-chat-response", create_chat_response);
router.patch("/delete_chat_section", delete_chat_section);

export default router;
