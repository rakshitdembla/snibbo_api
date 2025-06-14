import mongoose from "mongoose";
import { ObjectId } from "../utils/schema_types.js";

const chatSchema = new mongoose.Schema({
    participants: {
        type: [ObjectId],
        ref: "users",
        required: true
    },

    lastMessage: {
        type: ObjectId,
        ref: "messages"
    },

    isBlocked: {
        type: Boolean,
        default: false
    },

    blockedBy: {
        type: ObjectId,
        ref: "users",
        default: null
    },

    isPinned: {
        type: Boolean,
        defaul: false
    }

},

    {
        timestamps: true
    }

);

export const Chat = mongoose.model("chats", chatSchema);