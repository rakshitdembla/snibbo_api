import express from "express";
import {isAuthenticated} from "../middlewares/auth.js";
import { getAllPosts,getFollowingPosts } from "../controllers/posts/get_posts.js";
import {deletePost} from "../controllers/posts/delete_post.js";
import { createPost } from "../controllers/posts/create_post.js";
import { updatePost } from "../controllers/posts/update_post.js";
import {likePost} from "../controllers/posts/like/like_post.js";
import {dislikePost} from "../controllers/posts/like/dislike_post.js";
import { likedUsers } from "../controllers/posts/like/liked_users.js";
import { addComment,addReply } from "../controllers/posts/comments/create_comment.js";
import { removeComment,removeReply } from "../controllers/posts/comments/remove_comment.js";

const postsRouter = express.Router();

postsRouter.get("/all",getAllPosts);
postsRouter.get("/followings/:userId",isAuthenticated,getFollowingPosts);
postsRouter.delete("/delete/:postId",isAuthenticated,deletePost);
postsRouter.post("/create",isAuthenticated,createPost);
postsRouter.patch("/update/:postId",isAuthenticated,updatePost);

postsRouter.post("/like/:postId",isAuthenticated,likePost);
postsRouter.post("/dislike/:postId",isAuthenticated,dislikePost);
postsRouter.post("/liked-users/:postId",likedUsers);

postsRouter.post("/add-comment/:postId",isAuthenticated,addComment);
postsRouter.post("/add-reply/:commentId",isAuthenticated,addReply);
postsRouter.post("/remove-comment/:commentId",isAuthenticated,removeComment);
postsRouter.post("/remove-reply/:replyId",isAuthenticated,removeReply);

export {postsRouter};