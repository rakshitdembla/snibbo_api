import mongoose from "mongoose";
import { ObjectId } from "../utils/schema_types.js";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        maxlength: 20
    },

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true,
        maxlength: 124
    },

    password: {
        type: String,
        required: true,
    },

    profilePicture: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        default: ""
    },

    followers: {
        type: [ObjectId],
        ref: "users",
        default: []
    },
    followings: {
        type: [ObjectId],
        ref: "users",
        default: []
    },

    userPosts: {
        type: [ObjectId],
        ref: "posts",
        default: []
    },

    userStories: {
        type: [ObjectId],
        ref: "stories",
        default: []
    },

    savedPosts: {
        type: [ObjectId],
        ref: "posts",
        default: []
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    lastSeen: {
        type: Date,
        default: null
    },
    
    isOnline: {
        type: Boolean,
        default: false,
    },

    blockedUsers: {
    type: [ObjectId],
    ref: "users",
    default: []
}

},

    {
        timestamps: true
    });

export const User = mongoose.model("users", userSchema);