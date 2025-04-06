import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import createError from "http-errors";

// Mock DB (in-memory)
const users: { id: string; email: string; password?: string }[] = [];

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });
};

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

// 📧 Email Registration
export async function emailRegister(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const userExists = users.find((u) => u.email === email);
    if (userExists) return next(createError.Conflict("Email already exists"));

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now().toString(), email, password: hashedPassword };
    users.push(newUser);

    const token = generateToken(newUser.id);
    res.status(201).json({ message: "Registered successfully", token });
  } catch (err) {
    next(err);
  }
}

// 📧 Email Login
export async function emailLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);
    if (!user || !user.password) return res.status(400).json({ message: "User not found or uses Google login" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: "Invalid password" });

    const token = generateToken(user.id);
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
}

// 🟦 Google Registration & Login
export async function googleAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: "Missing Google credential" });

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload.sub) return res.status(401).json({ message: "Invalid Google token" });

    let user = users.find((u) => u.email === payload.email);
    if (!user) {
      user = { id: payload.sub, email: payload.email };
      users.push(user);
    }

    const token = generateToken(user.id);
    res.status(200).json({ token });
  } catch (err) {
    next(createError.Unauthorized("Google token verification failed"));
  }
}