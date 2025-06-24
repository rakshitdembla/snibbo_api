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
        ref: "messages",
        default : null
    },
},

    {
        timestamps: true
    }

);

export const Chat = mongoose.model("chats", chatSchema);