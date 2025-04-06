import { Router, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { verifyToken, emailLogin, googleLoginHandler } from "./loginController";

const router = Router();

interface AuthenticatedRequest extends Request {
  userId?: string;
}

// ✅ For verifying Google JWT token (used after Google login)
router.get("/verify", verifyToken, asyncHandler( async (req: AuthenticatedRequest, res: Response) => {
  res.json({ userId: req.userId });
}));

// ✅ Email login route
router.post("/email-login", asyncHandler(emailLogin));

// ✅ Google login route (new)
router.post("/google-login", asyncHandler(googleLoginHandler));

export default router;
