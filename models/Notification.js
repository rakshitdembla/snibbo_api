import mongoose from "mongoose";
import { ObjectId } from "../utils/schema_types.js";

const notificationSchema = new mongoose.Schema({
    reciever: {
        type: ObjectId,
        ref: "users",
        required: true
    },

    sender: {
        type: ObjectId,
        ref: "users",
        required: true
    },

    notificationContent: {
        type: String,
        required: true
    },

    isSeen: {
        type: Boolean,
        default: false
    },
},

    {
        timestamps: true
    }

);

export const Notification = mongoose.model("notifications",notificationSchema);