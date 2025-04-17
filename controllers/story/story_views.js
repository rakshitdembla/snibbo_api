import { Story } from "../../models/Story.js";
import { serverError } from "../../utils/server_error_res.js";
import mongoose from "mongoose";

export const storyViews = async (req, res) => {
    try {
        const userId = req.userId;
        const { storyId } = req.params;

        const story = await Story.findById(storyId).lean();

        if (!story|| mongoose.Types.ObjectId.isValid(storyId)) {
            return res.status(404).json({
                success: false,
                message: "Story not found or Invalid story id."
            });
        }

        if (userId != story.userId) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized to get views for this story."
            });
        }

        const storyViews = await Story.findById(storyId).select("storyViews -_id").populate({
            path: "storyViews",
            model: "users",
            select: "-_id name username profilePicture isVerified"

        });

        return res.status(200).json({
            success: true,
            storyViews
        });

    } catch (e) {
        serverError(res, e);
    }

}