import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addStory } from "../controllers/story/create_story.js";
import { viewStory } from "../controllers/story/view_story.js";
import { deleteStory } from "../controllers/story/delete_story.js";
import { storyViews } from "../controllers/story/story_views.js";
import { followingStories } from "../controllers/story/followings_stories.js";
import { getUserStories } from "../controllers/story/get_user_stories.js";
import { getMyStories } from "../controllers/story/get_my_stories.js";

const storyRouter = express.Router();

// POST route to create a new story - requires story data in body and authentication
storyRouter.post("/create", isAuthenticated, addStory);

// POST route to mark a story as viewed - requires storyId and authentication
storyRouter.post("/view/:storyId", isAuthenticated, viewStory);

// DELETE route to delete a story - requires storyId and authentication
storyRouter.delete("/delete/:storyId", isAuthenticated, deleteStory);

// GET route to fetch users who viewed a story - requires storyId and authentication
storyRouter.get("/view-users/:storyId", isAuthenticated, storyViews);

// GET route to fetch stories from users you follow - requires authentication
storyRouter.get("/followings/stories", isAuthenticated, followingStories);

// GET route to fetch your own stories - requires authentication
storyRouter.get("/my-stories", isAuthenticated, getMyStories);

// GET route to fetch stories of a specific user - requires username
storyRouter.get("/user-stories/:username", getUserStories);

export { storyRouter };
