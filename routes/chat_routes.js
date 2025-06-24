import express from "express";
import { getBlockedUsers } from "../controllers/chats/get_blocked_users.js";
import { blockUser, unblockUser } from "../controllers/chats/toogle_block_user.js";
import { getChatList } from "../controllers/chats/get_chat_list.js";
import { getChats } from "../controllers/chats/get_chats.js";
import { isAuthenticated } from "../middlewares/auth.js";

const chatRouter = express.Router();

// GET route to fetch all blocked users - requires authentication
chatRouter.get("/blocked-users", isAuthenticated, getBlockedUsers);

// GET route to fetch user's chat list - requires authentication
chatRouter.get("/chats-list", isAuthenticated, getChatList);

// GET route to fetch chats with specific user - requires username param and authentication
chatRouter.get("/chats/:username", isAuthenticated, getChats);

// POST route to block a user - requires username param and authentication
chatRouter.post("/block/:username", isAuthenticated, blockUser);

// POST route to unblock a user - requires username param and authentication
chatRouter.post("/unblock/:username", isAuthenticated, unblockUser);

export { chatRouter };