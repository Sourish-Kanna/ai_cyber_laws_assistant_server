import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const PORT = process.env.CLIENT_PORT;
app.use(
    cors({
        origin: [`http:localhost:${PORT}`],
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
