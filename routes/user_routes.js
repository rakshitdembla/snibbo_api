import express from "express";
import {isAuthenticated} from "../middlewares/auth.js";
import { getUserProfile } from "../controllers/user/get_users_profile.js";
import { getUserFollowings } from "../controllers/user/get_user_followings.js";
import { getUserFollowers } from "../controllers/user/get_user_followers.js";
import { followUser } from "../controllers/user/follow_user.js";

const userRoutes = express.Router();

userRoutes.get("/profile/:username",getUserProfile);
userRoutes.get("/followers/:username",getUserFollowers);
userRoutes.get("/followings/:username",getUserFollowings);


userRoutes.get("/follow/:username",isAuthenticated,followUser);

export {userRoutes}