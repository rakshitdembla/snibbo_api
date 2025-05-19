import mongoose, { mongo } from "mongoose";
import { ObjectId } from "../utils/schema_types.js";

const storySchema = new mongoose.Schema({

    userId: {
        type: ObjectId,
        ref: "users",
        required: true
    },

    contentType: {
        type: String,
        required: true
    },

    storyContent: {
        type: String,
        required: true
    },

    storyViews: {
        type: [ObjectId],
        ref: "users",
        default: []
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires:  24 * 60 * 60
    }
},
);

export const Story = mongoose.model("stories", storySchema);