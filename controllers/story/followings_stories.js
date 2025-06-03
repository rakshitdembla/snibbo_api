import { User } from "../../models/User.js";
import { serverError } from "../../utils/server_error_res.js";

export const followingStories = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const userId = req.userId;

        const result = await User.findById(userId).select("followings").populate({
            path: "followings",
            model: "users",
            select: "-_id userStories name username isVerified profilePicture",
            populate: {
                path: "userStories",
                model: "stories",
                select: "storyViews"
            }
        });

        const storyUsers = result.followings
            .filter(user => user.userStories.length > 0)
            .map(user => {
                const storiesSeen = user.userStories.every(story =>
                    story.storyViews.includes(userId)
                );
                return {
                    username: user.username,
                    name: user.name,
                    isVerified: user.isVerified,
                    profilePicture: user.profilePicture,
                    storiesSeen: storiesSeen
                }
            }
            );

            const sortedStoryUsers = storyUsers.sort((a,b) => a.storiesSeen - b.storiesSeen).slice(skip, skip + limit);

        return res.status(200).json({
            success: true,
            followings: sortedStoryUsers
        });

    } catch (e) {
        serverError(res, e);
    }

}
