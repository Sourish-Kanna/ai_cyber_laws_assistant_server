import { Router, Request, Response } from "express";
import { verifyToken } from "./loginController";

const router = Router();

interface AuthenticatedRequest extends Request {
  userId?: string;
}

router.get("/verify", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  res.json({ userId: req.userId });
});

export default router;
