import mongoose from "mongoose";
import { ObjectId } from "../utils/schema_types.js";

const messageSchema = new mongoose.Schema({
    chat: {
        type: ObjectId,
        ref: "chats",
        required: true
    },

    sender: {
        type: ObjectId,
        ref: "users",
        required: true
    },

    text: {
        type: String
    },

    media: {
        type: String
    },

    seenBy: {
        type: [ObjectId],
        ref: "users",
        default: []
    },

},

    {
        timestamps: true
    }

);

export const Message = mongoose.model("messages", messageSchema);