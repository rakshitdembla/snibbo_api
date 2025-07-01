import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";

import { getAllPosts, getFollowingPosts, explorePosts } from "../controllers/posts/get_posts.js";
import { deletePost } from "../controllers/posts/delete_post.js";
import { createPost } from "../controllers/posts/create_post.js";
import { updatePost } from "../controllers/posts/update_post.js";

import { likePost } from "../controllers/posts/like/like_post.js";
import { dislikePost } from "../controllers/posts/like/dislike_post.js";
import { likedUsers } from "../controllers/posts/like/liked_users.js";
import { searchPostLikedUsers } from "../controllers/posts/like/search_post_liked_users.js";

import { addComment, addReply } from "../controllers/posts/comments/create_comment.js";
import { removeComment, removeReply } from "../controllers/posts/comments/remove_comment.js";
import { getComments, getReplies } from "../controllers/posts/comments/get_comments.js";
import { commentLikedUsers, replyLikedUsers } from "../controllers/posts/comments/comment_liked_users.js";
import { likeComment, likeReply } from "../controllers/posts/comments/like_comment.js";
import { dislikeComment, dislikeReply } from "../controllers/posts/comments/dislike_comment.js";
import {searchCommentLikedUsers,searchReplyLikedUsers} from "../controllers/posts/comments/search_comment_liked_users.js";

import { savePost } from "../controllers/posts/saved/save_post.js";
import { getSavedPosts } from "../controllers/posts/saved/user_saved_posts.js";
import { removeSavedPost } from "../controllers/posts/saved/remove_saved_post.js";

import { getUserPosts } from "../controllers/posts/get_user_posts.js";
import { getPostById } from "../controllers/posts/get_post_by_id.js";

const postsRouter = express.Router();


// ===============================
// 📌 Post CRUD
// ===============================

// POST route to create a post - requires post data in body and authentication
postsRouter.post("/create", isAuthenticated, createPost);

// PATCH route to update a post - requires postId and updated data in body with authentication
postsRouter.patch("/update/:postId", isAuthenticated, updatePost);

// DELETE route to delete a post - requires postId and authentication
postsRouter.delete("/delete/:postId", isAuthenticated, deletePost);


// ===============================
// 📄 Post Retrieval
// ===============================

// GET route to fetch posts from following users - requires authentication
postsRouter.get("/following-posts", isAuthenticated, getFollowingPosts);

// GET route to fetch all posts - requires authentication
postsRouter.get("/all", isAuthenticated, getAllPosts);

// GET route to explore posts - requires authentication
postsRouter.get("/explore", isAuthenticated, explorePosts);

// GET route to fetch posts from a specific user - requires username and authentication
postsRouter.get("/user-posts/:username", isAuthenticated, getUserPosts);

// GET route to fetch a specific post- requires postId and authentication
postsRouter.get("/get-post/:postId", isAuthenticated, getPostById);


// ===============================
// 👍 Post Likes
// ===============================

// POST route to like a post - requires postId and authentication
postsRouter.post("/like/:postId", isAuthenticated, likePost);

// POST route to dislike a post - requires postId and authentication
postsRouter.post("/dislike/:postId", isAuthenticated, dislikePost);

// GET route to fetch users who liked a specific post - requires postId and authentication
postsRouter.get("/liked-users/:postId", isAuthenticated, likedUsers);

// GET route to search liked users on a post - requires postId, username, and authentication
postsRouter.get("/search-post-liked-user/:postId/:username", isAuthenticated, searchPostLikedUsers);

// GET route to search liked users on a post - requires postId and authentication(error handling route)
postsRouter.get("/search-post-liked-user/:postId", isAuthenticated, searchPostLikedUsers);


// ===============================
// 💬 Comments
// ===============================

// POST route to add a comment on a post - requires postId, comment data and authentication
postsRouter.post("/add-comment/:postId", isAuthenticated, addComment);

// DELETE route to remove a comment - requires commentId and authentication
postsRouter.delete("/remove-comment/:commentId", isAuthenticated, removeComment);

// GET route to fetch all comments on a post - requires postId and authentication
postsRouter.get("/all-comments/:postId", isAuthenticated, getComments);

// POST route to like a comment - requires commentId and authentication
postsRouter.post("/like-comment/:commentId", isAuthenticated, likeComment);

// POST route to dislike a comment - requires commentId and authentication
postsRouter.post("/dislike-comment/:commentId", isAuthenticated, dislikeComment);

// GET route to fetch users who liked a specific comment - requires commentId and authentication
postsRouter.get("/comment-likes/:commentId", isAuthenticated, commentLikedUsers);

// GET route to search users who liked a specific comment - requires commentId, username to search and authentication
postsRouter.get("/search-comment-liked-user/:commentId/:username", isAuthenticated, searchCommentLikedUsers);

// GET route to search users who liked a specific comment - requires commentId and authentication(error handling route)
postsRouter.get("/search-comment-liked-user/:commentId", isAuthenticated, searchCommentLikedUsers);


// ===============================
// 💬 Replies
// ===============================

// POST route to add a reply to a comment - requires commentId, reply data and authentication
postsRouter.post("/add-reply/:commentId", isAuthenticated, addReply);

// DELETE route to remove a reply - requires replyId and authentication
postsRouter.delete("/remove-reply/:replyId", isAuthenticated, removeReply);

// GET route to fetch all replies to a comment - requires commentId and authentication
postsRouter.get("/all-replies/:commentId", isAuthenticated, getReplies);

// POST route to like a reply - requires replyId and authentication
postsRouter.post("/like-reply/:replyId", isAuthenticated, likeReply);

// POST route to dislike a reply - requires replyId and authentication
postsRouter.post("/dislike-reply/:replyId", isAuthenticated, dislikeReply);

// GET route to fetch users who liked a specific reply - requires replyId and authentication
postsRouter.get("/reply-likes/:replyId", isAuthenticated, replyLikedUsers);

// GET route to search users who liked a specific reply - requires replyId, username to search and authentication
postsRouter.get("/search-reply-liked-user/:replyId/:username", isAuthenticated, searchReplyLikedUsers);

// GET route to search users who liked a specific reply - requires replyId and authentication(error handling route)
postsRouter.get("/search-reply-liked-user/:replyId", isAuthenticated, searchReplyLikedUsers);


// ===============================
// 💾 Saved Posts
// ===============================

// POST route to save a post - requires postId and authentication
postsRouter.post("/save/:postId", isAuthenticated, savePost);

// GET route to fetch saved posts of a user - requires username and authentication
postsRouter.get("/saved-posts/:username", isAuthenticated, getSavedPosts);

// POST route to remove a saved post - requires postId and authentication
postsRouter.post("/remove-saved/:postId", isAuthenticated, removeSavedPost);

export { postsRouter };
