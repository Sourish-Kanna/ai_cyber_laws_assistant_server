import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'

const app = express();

dotenv.config({
    path: "./.env",
});


const PORT = process.env.CLIENT_PORT;
app.use(
    cors({
        origin: [
            `http://localhost:${PORT}`,
            // `http://localhost:${process.env.CLIENT_PORT}`
            // `http://localhost:5173`
        ],
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./controllers/User/user.route";
import chatRoute from "./controllers/Chat/chatRoute";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat", chatRoute);

export default app;
