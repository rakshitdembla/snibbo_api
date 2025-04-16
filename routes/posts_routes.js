import express from "express";
import {isAuthenticated} from "../middlewares/auth.js";
import { getAllPosts,getFollowingPosts } from "../controllers/posts/get_posts.js";
import {deletePost} from "../controllers/posts/delete_post.js";
import { createPost } from "../controllers/posts/create_post.js";
import { updatePost } from "../controllers/posts/update_post.js";

const postsRouter = express.Router();

postsRouter.get("/all",getAllPosts);
postsRouter.get("/followings/:userId",isAuthenticated,getFollowingPosts);
postsRouter.delete("/delete/:postId",isAuthenticated,deletePost);
postsRouter.post("/create",isAuthenticated,createPost);
postsRouter.patch("/update/:postId",isAuthenticated,updatePost);

export {postsRouter};