import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getUserFollowings } from "../controllers/user/get_user_followings.js";
import { getUserFollowers } from "../controllers/user/get_user_followers.js";
import { followUser } from "../controllers/user/follow_user.js";
import { unfollowUser } from "../controllers/user/unfollow_user.js";
import { removeFromFollowing } from "../controllers/user/remove_from_following.js";
import { updateUserProfile } from "../controllers/user/update_profile.js";
import { getUserByUsername } from "../controllers/user/get_user_by_username.js";
import { searchFollower } from "../controllers/user/search_follower.js";
import { searchFollowing } from "../controllers/user/search_following.js";
import { searchUser } from "../controllers/user/search_user.js";

const userRoutes = express.Router();

// GET route to fetch followers - requires username and authentication
userRoutes.get("/followers/:username", isAuthenticated, getUserFollowers);

// GET route to fetch followings - requires username and authentication
userRoutes.get("/followings/:username", isAuthenticated, getUserFollowings);

// POST route to follow a user - requires username and authentication
userRoutes.post("/follow/:username", isAuthenticated, followUser);

// POST route to unfollow a user - requires username and authentication
userRoutes.post("/unfollow/:username", isAuthenticated, unfollowUser);

// POST route to remove a user from following list - requires username and authentication
userRoutes.post("/remove/:username", isAuthenticated, removeFromFollowing);

// PATCH route to update user profile - requires updated fields in body and authentication
userRoutes.patch("/update-profile", isAuthenticated, updateUserProfile);

// GET route to fetch user profile by username - requires authentication
userRoutes.get("/profile/:username", isAuthenticated, getUserByUsername);

// GET route to search followers by username - requires base username and authentication
userRoutes.get("/search-follower/:username", isAuthenticated, searchFollower);

// GET route to search followers by username and search term - requires both and authentication(error handling route)
userRoutes.get("/search-follower/:username/:userToSearch", isAuthenticated, searchFollower);

// GET route to search followings by username - requires base username and authentication
userRoutes.get("/search-following/:username", isAuthenticated, searchFollowing);

// GET route to search followings by username and search term - requires both and authentication(error handling route)
userRoutes.get("/search-following/:username/:userToSearch", isAuthenticated, searchFollowing);

// GET route to search for users - with username requires authentication
userRoutes.get("/search-user/:username",isAuthenticated, searchUser);

// GET route to search for users - with username requires authentication(error handling route)
userRoutes.get("/search-user",isAuthenticated, searchUser);

export { userRoutes };
