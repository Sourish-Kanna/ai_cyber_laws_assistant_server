import createError from 'http-errors';
import { OAuth2Client } from 'google-auth-library';
import { Request, Response, NextFunction } from "express";


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

interface AuthenticatedRequest extends Request {
    userId?: string;
}

export async function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        next(createError.Unauthorized());
        return;
    }
    const token = authHeader.split(" ")[1];
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    if (payload) {
        req.userId = payload['sub'];
        next();
        return;
    }
    next(createError.Unauthorized());
}