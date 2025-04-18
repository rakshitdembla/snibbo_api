import express from "express";
import { getUserProfile } from "../controllers/user/get_users_profile.js";

const userRoutes = express.Router();

userRoutes.get("/profile/:username",getUserProfile);

export {userRoutes}