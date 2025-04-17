import mongoose from "mongoose";
import { ObjectId } from "../utils/schema_types.js";

const replySchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "users",
        required: true
    },

    replyContent: {
        type: String,
        required: true
    },

    replyLikes: {
       type: [ObjectId],
       ref: "users",
       default: []
    }
},

    {
        timestamps: true
    }

);

export const Reply = mongoose.model("replies",replySchema);