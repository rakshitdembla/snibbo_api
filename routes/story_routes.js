import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addStory } from "../controllers/story/create_story.js";
import {viewStory}  from "../controllers/story/view_story.js";
import {deleteStory} from "../controllers/story/delete_story.js";
import {storyViews} from "../controllers/story/story_views.js";
import {followingStories} from "../controllers/story/followings_stories.js";
import {getUserStories} from "../controllers/story/get_user_stories.js";
import {getMyStories} from "../controllers/story/get_my_stories.js";

const storyRouter = express.Router();

storyRouter.post("/create",isAuthenticated,addStory);
storyRouter.post("/view/:storyId",isAuthenticated,viewStory);
storyRouter.delete("/delete/:storyId",isAuthenticated,deleteStory);
storyRouter.get("/view-users/:storyId",isAuthenticated,storyViews);
storyRouter.get("/followings/stories",isAuthenticated,followingStories);
storyRouter.get("/my-stories",isAuthenticated,getMyStories);
storyRouter.get("/user-stories/:username",getUserStories);

export { storyRouter }