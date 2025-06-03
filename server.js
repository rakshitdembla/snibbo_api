import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cluster from "cluster";
import ratelimit from "express-rate-limit";
import os from "node:os";
import { authRouter } from "./routes/auth_routes.js";
import { postsRouter } from "./routes/posts_routes.js";
import { storyRouter } from "./routes/story_routes.js";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { User } from "./models/User.js";
import { reportRouter } from "./routes/report_routes.js";
import { userRoutes } from "./routes/user_routes.js";

try {
    dotenv.config()
    const app = express();
    const port = 3000;
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "*",
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected", socket.id);

        socket.on("userOnline", async (userId) => {

            try {
                await User.findByIdAndUpdate(userId, {
                    isOnline: true
                });

                console.log(`User ${userId} is now online`);

            } catch (e) {
                console.log("Error setting user online:", e)
            }
        });

        socket.on("storeUserId", (userId) => {
            socket.userId = userId
        });

        socket.on("disconnect", async () => {
            console.log("User disconnected", socket.id);

            try {

                await User.findByIdAndUpdate(socket.userId, {
                    isOnline: false,
                    lastSeen: Date.now()
                });

                console.log(`User ${socket.userId} is now offline`);

            } catch (e) {
                console.error("Error setting user offline:", e);
            }

        });

    });

    const cpus = os.cpus().length;

    const limiter = ratelimit({
        max: 600,
        windowMs: 60 * 60 * 1000,
        message: "Too many requests. Please try again later"

    });

    if (cluster.isPrimary) {
        for (let i = 0; i < cpus; i++) {
            cluster.fork();
        }
        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died. Code: ${code}, Signal: ${signal}`);
        });
    }

    else {
        server.listen(port, '0.0.0.0', () => { console.log(`Server running at ${port}`) });

        async function serverConnection() {
            await mongoose.connect(process.env.MONGOOSE_CONNECTION, {
                dbName: "snibbo",
            });
            app.use(cors());
            app.use(express.urlencoded({ extended: true }));
            app.use(express.json());
            app.use(limiter);
            app.use("/api/auth", authRouter);
            app.use("/api/posts", postsRouter);
            app.use("/api/story", storyRouter);
            app.use("/api/report", reportRouter);
            app.use("/api/user", userRoutes);
        }
        serverConnection();
    }
} catch (e) {
    console.log(e);
}