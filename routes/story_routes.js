import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";

const storyRouter = express.Router();

export {storyRouter}