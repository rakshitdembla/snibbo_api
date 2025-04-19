import { Story } from "../../models/Story.js";
import { User } from "../../models/User.js";
import { serverError } from "../../utils/server_error_res.js";
import mongoose from "mongoose";

export const deleteStory = async (req, res) => {
    try {
        const userId = req.userId;
        const { storyId } = req.params;
        const story = await Story.findById(storyId).lean();

        if (!story || !mongoose.Types.ObjectId.isValid(storyId)) {
            return res.status(404).json({
                success: false,
                message: "Story not found or Invalid story id."
            });
        }

        if (userId != story.userId) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized to remove this story."
            });
        }
        
        await User.updateMany({
            userStories: storyId
        },{
            $pull: {
                userStories: storyId
            }
        });

        await Story.findByIdAndDelete(storyId);

        return res.status(202).json({
            success: true,
            message: "Story deleted successfully."
        });

    } catch (e) {
        serverError(res, e);
    }
}