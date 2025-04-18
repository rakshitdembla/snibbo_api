import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getAllPosts,getFollowingPosts } from "../controllers/posts/get_posts.js";
import { deletePost } from "../controllers/posts/delete_post.js";
import { createPost } from "../controllers/posts/create_post.js";
import { updatePost } from "../controllers/posts/update_post.js";
import { likePost } from "../controllers/posts/like/like_post.js";
import { dislikePost } from "../controllers/posts/like/dislike_post.js";
import { likedUsers } from "../controllers/posts/like/liked_users.js";
import { addComment,addReply } from "../controllers/posts/comments/create_comment.js";
import { removeComment,removeReply } from "../controllers/posts/comments/remove_comment.js";
import { getComments,getReplies } from "../controllers/posts/comments/get_comments.js";
import { commentLikedUsers , replyLikedUsers } from "../controllers/posts/comments/comment_liked_users.js";
import { likeComment,likeReply } from "../controllers/posts/comments/like_comment.js";
import { dislikeComment, dislikeReply } from "../controllers/posts/comments/dislike_comment.js";
import { savePost } from "../controllers/posts/saved/save_post.js";
import { getSavedPosts } from "../controllers/posts/saved/user_saved_posts.js";
import { removeSavedPost } from "../controllers/posts/saved/remove_saved_post.js";

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

postsRouter.get("/all-comments/:postId",getComments);
postsRouter.get("/all-replies/:commentId",getReplies);

postsRouter.get("/comment-likes/:commentId",commentLikedUsers);
postsRouter.get("/reply-likes/:replyId",replyLikedUsers);
postsRouter.post("/like-comment/:commentId",isAuthenticated,likeComment);
postsRouter.post("/like-reply/:replyId",isAuthenticated,likeReply);
postsRouter.post("/dislike-comment/:commentId",isAuthenticated,dislikeComment);
postsRouter.post("/dislike-reply/:replyId",isAuthenticated,dislikeReply);

postsRouter.post("/save/:postId",isAuthenticated,savePost);
postsRouter.get("/saved",isAuthenticated,getSavedPosts);
postsRouter.post("/remove-saved/:postId",isAuthenticated,removeSavedPost);

export {postsRouter};