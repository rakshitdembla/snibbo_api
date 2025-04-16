import mongoose from "mongoose";
import { ObjectId } from "../utils/schema_types.js";
const commentSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "users",
        required: true
    },

    commentContent: {
        type: String,
        required: true
    },

    commentLike: {
        type: Number,
        default: 0
    },

    commentReplies: {
        type: [ObjectId],
        ref: "replies",
        default: []
    }
},

    {
        timestamps: true
    });

export const Comment = mongoose.model("comments", commentSchema);