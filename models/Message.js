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

    isSeen: {
        type: Boolean,
        default: false
    }

},

    {
        timestamps: true
    }

);

export const Message = mongoose.model("messages", messageSchema);