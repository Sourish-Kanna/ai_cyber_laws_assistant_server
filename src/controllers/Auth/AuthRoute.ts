import { Router, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { verifyToken, emailLogin, emailRegister, googleAuth } from "./AuthController";

const router = Router();

interface AuthenticatedRequest extends Request {
  userId?: string;
}

// ✅ For verifying Google JWT token (used after Google login)
router.get("/verify", verifyToken, asyncHandler( async (req: AuthenticatedRequest, res: Response) => {
  res.json({ userId: req.userId });
}));

// ✅ Email login route
router.post("/login", asyncHandler(emailLogin));

// ✅ Email Register route
router.post("/register", asyncHandler(emailRegister));

// ✅ Google login route
router.post("/google", asyncHandler(googleAuth));

export default router;
