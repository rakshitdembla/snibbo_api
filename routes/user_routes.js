import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getUserFollowings } from "../controllers/user/get_user_followings.js";
import { getUserFollowers } from "../controllers/user/get_user_followers.js";
import { followUser } from "../controllers/user/follow_user.js";
import { unfollowUser } from "../controllers/user/unfollow_user.js";
import { removeFromFollowing } from "../controllers/user/remove_from_following.js";
import { updateUserProfile } from "../controllers/user/update_profile.js";
import { getUserByUsername } from "../controllers/user/get_user_by_username.js";

const userRoutes = express.Router();

userRoutes.get("/followers/:username", getUserFollowers);
userRoutes.get("/followings/:username", getUserFollowings);

userRoutes.post("/follow/:username", isAuthenticated, followUser);
userRoutes.post("/unfollow/:username", isAuthenticated, unfollowUser);
userRoutes.post("/remove/:username", isAuthenticated, removeFromFollowing);
userRoutes.patch("/update-profile", isAuthenticated, updateUserProfile );
userRoutes.get("/profile/:username",isAuthenticated, getUserByUsername);

export { userRoutes }