import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addStory } from "../controllers/story/create_story.js";
import {viewStory}  from "../controllers/story/view_story.js";
import {deleteStory} from "../controllers/story/delete_story.js";

const storyRouter = express.Router();

storyRouter.post("/create",isAuthenticated,addStory);
storyRouter.post("/view/:storyId",isAuthenticated,viewStory);
storyRouter.post("/delete/:storyId",isAuthenticated,viewStory);

export { storyRouter }