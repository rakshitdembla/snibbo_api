import { Story } from "../../models/Story.js";
import { serverError } from "../../utils/server_error_res.js";
import mongoose from "mongoose";

export const viewStory = async (req, res) => {
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

        await Story.findByIdAndUpdate(storyId, {
            $addToSet: {
                storyViews: userId
            }
        });

        return res.status(202).json({
            success: true,
            message: "Story view added successfully."
        });
        
    } catch (e) {
        serverError(res, e);
    }
}