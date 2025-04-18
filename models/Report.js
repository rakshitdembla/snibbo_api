import mongoose from "mongoose";
import { ObjectId } from "../utils/schema_types.js";

const reportSchema = new mongoose.Schema({
    contentId: {
        type: ObjectId,
        required: true
    },
    
    reportFor: {
        type: String,
        required: true
    },

    reportDesc: {
        type: String,
        required: true
    },

    reportedBy: {
        type: ObjectId,
        ref: "users",
        required: true
    }
});

export const Report = mongoose.model("reports",reportSchema);