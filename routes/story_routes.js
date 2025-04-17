import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {addStory} from "../controllers/story/create_story.js";

const storyRouter = express.Router();

storyRouter.post("/create",isAuthenticated,addStory);

export { storyRouter }