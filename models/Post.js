import mongoose from "mongoose";
import { ObjectId } from "../utils/schema_types.js";

const postSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "users",
        required: true
    },

    postContent: {
        type: String,
        required: true
    },

    contentType: {
        type: String,
        required: true
    },

    postCaption: {
        type: String,
        maxlength: 2000
    },

    postLikes: {
        type: [ObjectId],
        ref: "users",
        default: [],
    },

    postComments: {
        type: [ObjectId],
        ref: "comments",
        default: []
    },
},

    {
        timestamps: true
    });

export const Post = mongoose.model("posts", postSchema);