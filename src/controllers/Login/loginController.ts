import createError from "http-errors";
import { OAuth2Client } from "google-auth-library";
import { Request, Response, NextFunction } from "express";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export async function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(createError.Unauthorized("No token provided"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return next(createError.Unauthorized("Invalid token"));
    }

    req.userId = payload.sub;
    next();
  } catch (error) {
    next(createError.Unauthorized("Token verification failed"));
  }
}
