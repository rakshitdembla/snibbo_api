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
},

{
    timestamps: true
});

export const Story = mongoose.model("stories",storySchema);