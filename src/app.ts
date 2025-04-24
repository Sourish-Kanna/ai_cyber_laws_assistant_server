import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
import { Request, Response, NextFunction } from "express";

import userRouter from "./controllers/User/user.route";
import chatRoute from "./controllers/Chat/chatRoute";
import authRouter from "./controllers/Auth/AuthRoute";
// import community_Router from "./controllers/Community/Community_Route";

const app = express();

dotenv.config({
    path: "./.env",
});


app.use(
    cors({
        origin: [
            `http://localhost:${process.env.CLIENT_ORIGIN_PORT}`,
            "http://localhost:5174",
            `http://localhost:5173`,
            "https://cyber-law-assistant.vercel.app",
            "https://aicyberlawsassistantclient.vercel.app"
        ],
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/community", community_Router);


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    });
});



app.use((req, res) => {
    res.status(404).send({ message: "Not Found" });
});

export default app;
