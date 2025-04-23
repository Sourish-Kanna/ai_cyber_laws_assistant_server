import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import createError from "http-errors";
import knex from "../../db/constrants"; // Import knex instance

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// const generateToken = (userId: string) => {
//   return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });
// };

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export async function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.body.credential;
  if (!authHeader) return next(createError.Unauthorized("No token provided"));
  console.log("Authorization header:", authHeader.split); // Debugging

  // Ensure the token is in the "Bearer <token>" format
  const token = authHeader.split(" ")[0];
  if (!token) return next(createError.Unauthorized("Invalid token format"));

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) return next(createError.Unauthorized("Invalid token payload"));

    console.log("Google token payload:", payload); // Debugging

    req.userId = payload.sub; // Set the user ID from the token payload
    next();
  } catch (error) {
    console.error("Token verification error:", error); // Log the error for debugging
    next(createError.Unauthorized("Token verification failed"));
  }
}

// 📧 Email Registration
export async function emailRegister(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, name } = req.body;

    const userExists = await knex("User").where({ email }).first();
    if (userExists) return next(createError.Conflict("Email already exists"));

    const [newUser] = await knex("User")
      .insert({ email, name })
      .returning(["user_id", "email", "name"]);

    // const token = generateToken(newUser.user_id);
    const token = newUser.user_id;
    res.status(201).json({ message: "Registered successfully", token, name: newUser.name });
  } catch (err) {
    next(err);
  }
}

// 📧 Email Login
export async function emailLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;

    const user = await knex("User").where({ email }).first();
    if (!user) return res.status(400).json({ message: "User not found" });

    // const token = generateToken(user.user_id);
    const token = user.user_id;
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

    // console.log("Google credential:", credential); // Debugging

    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (err) {
      console.error("Error verifying Google ID token:", err); // Debugging
      return next(createError.Unauthorized("Google token verification failed"));
    }

    // console.log("Google ticket:", ticket); // Debugging

    const payload = ticket.getPayload();
    // console.log("Google token payload:", payload); // Debugging
    if (!payload?.email || !payload.sub) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    const userData = {
      // user_id: payload.sub,
      email: payload.email,
      name: payload.name || null,
      profile_img: payload.picture || null,
      username: payload.given_name || null,
      age: null,
      phone_no: null,
      status: true,
    };

    let user;
    try {
      user = await knex("User").where({ email: userData.email }).first();
      // console.log("User found:", user); // Debugging
      if (!user) {
        [user] = await knex("User").insert(userData).returning([
          "user_id",
          "email",
          "name",
          "profile_img",
          "phone_no",
          "username",
          "age",
          "status",
          "createdAt",
          "updatedAt",
        ]);
      }
    } catch (err) {
      console.error("Database error:", err); // Debugging
      return next(createError.InternalServerError("Database operation failed "));
    }

    // console.log("User data:", user); // Debugging

    // const token = generateToken(user.user_id);
    const token = user.user_id;
    // console.log("Generated token:", token); // Debugging

    res.status(200).json({
      token,
      user,
      message: "User authenticated successfully!",
    });
  } catch (err) {
    console.error("Unexpected error:", err); // Debugging
    next(createError.InternalServerError("An unexpected error occurred"));
  }
}