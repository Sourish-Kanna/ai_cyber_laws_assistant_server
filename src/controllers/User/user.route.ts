import { Router } from "express";
import { getAllUser, createUser, getUser } from "./user.controller";

const router = Router();

router.get("/all", getAllUser);
router.post("/create", createUser);
router.get("/:id", getUser);

export default router;
