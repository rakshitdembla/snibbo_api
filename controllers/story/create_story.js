import { Story } from "../../models/Story.js";
import { User } from "../../models/User.js";
import { serverError } from "../../utils/server_error_res.js";

export const addStory = async (req, res) => {
    try {
        const userId = req.userId;
        const { contentType, storyContent } = req.body;

        if (!contentType || !storyContent) {
            return res.status(400).json({
                success: false,
                message: "Story content & content type is required in body."
            });
        }

        const story = await Story.create({
            userId: userId,
            contentType: contentType,
            storyContent: storyContent,
        });

        await User.findByIdAndUpdate(userId, {
            $addToSet: {
                userStories: story._id
            }
        });

        const createdStory = story.toObject();
        delete createdStory.userId;

        return res.status(201).json({
            success: true,
            message: "Story added successfully.",
            createdStory
        })


    } catch (e) {
        serverError(res, e);
    }
}