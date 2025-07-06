import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import ratelimit from "express-rate-limit";
import { authRouter } from "./routes/auth_routes.js";
import { postsRouter } from "./routes/posts_routes.js";
import { storyRouter } from "./routes/story_routes.js";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { socketConnectionHandler } from "./controllers/sockets/socket_controller.js"
import { userRoutes } from "./routes/user_routes.js";
import { chatRouter } from "./routes/chat_routes.js";

try {
    dotenv.config()
    const app = express();
    app.set('trust proxy', 1);
    const port = process.env.PORT || 3000;
    const server = http.createServer(app);
    const io = new Server(server, {
        pingInterval: 25000,
        pingTimeout: 20000
        ,
        cors: {
            origin: [process.env.CLIENT_ORIGIN || "http://192.168.31.10:3000"],
            credentials: true,
        }
    });

    const limiter = ratelimit({
        max: 600,
        windowMs: 60 * 60 * 1000,
        message: "Too many requests. Please try again later"

    });

    server.listen(port, '0.0.0.0', () => { console.log(`Server running at ${port}`) });
    app.use(cors());

    async function serverConnection() {
        await mongoose.connect(process.env.MONGOOSE_CONNECTION, {
            dbName: "snibbo",
        });
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use(limiter);
        app.use("/api/auth", authRouter);
        app.use("/api/posts", postsRouter);
        app.use("/api/story", storyRouter);
        app.use("/api/user", userRoutes);
        app.use("/api/chat", chatRouter);
    }
    socketConnectionHandler(io);
    serverConnection();

} catch (e) {
    console.log(e);
}