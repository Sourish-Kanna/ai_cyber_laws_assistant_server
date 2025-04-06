import createError from "http-errors";
import { OAuth2Client } from "google-auth-library";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Replace this with your actual user DB logic
const fakeUsersDB = [
  { id: "1", email: "user@example.com", password: bcrypt.hashSync("123456", 10) },
];

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export async function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(createError.Unauthorized("No token provided"));

  const token = authHeader.split(" ")[0];

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) return next(createError.Unauthorized("Invalid token"));

    req.userId = payload.sub;
    next();
  } catch (error) {
    next(createError.Unauthorized("Token verification failed"));
  }
}

export async function emailLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = fakeUsersDB.find((u) => u.email === email);
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    return res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
}

export async function googleLoginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    // console.log("Incoming Google login request body:", req.body); // ✅ Add this line

    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Missing Google credential in request body" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) return res.status(401).json({ message: "Invalid Google token" });

    const token = jwt.sign({ userId: payload.sub }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
}
