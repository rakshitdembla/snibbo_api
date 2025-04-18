import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cluster from "cluster";
import ratelimit from "express-rate-limit";
import os from "node:os";
import { authRouter } from "./routes/auth_routes.js";
import { postsRouter } from "./routes/posts_routes.js";
import { storyRouter } from "./routes/story_routes.js";
import { reportRouter } from "./routes/report_routes.js";
import { userRouter } from "./routes/user_routes.js";

dotenv.config()
const app = express();
const port = 3000;

const cpus = os.cpus().length;

const limiter = ratelimit({
    max: 600,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests. Please try again later"

});

try {

    if (cluster.isPrimary) {
        for (let i = 0; i < cpus; i++) {
            cluster.fork();
        }
        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died. Code: ${code}, Signal: ${signal}`);
        });
    }

    else {

        app.listen(port, () => { console.log(`Server running at ${port}`) });

        async function serverConnection() {
            await mongoose.connect(process.env.MONGOOSE_CONNECTION, {
                dbName: "snibbo",
            });
            app.use(express.urlencoded({ extended: true }));
            app.use(express.json());
            app.use(limiter);
            app.use("/api/auth", authRouter);
            app.use("/api/posts", postsRouter);
            app.use("/api/story",storyRouter);
            app.use("/api/report",reportRouter);
            app.use("/api/user",userRouter);
        }
        serverConnection();
    }
} catch (e) {
    console.log(e);
}