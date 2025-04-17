import { User } from "../../models/User.js";
import { serverError } from "../../utils/server_error_res.js";

export const followingStories = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const userId = req.userId;

        const stories = await User.findById(userId).select("followings").populate({
            path: "followings",
            model: "users",
            select: "-_id userStories",
            populate: {
                path: userStories,
                model: "stories",
                select: "-storyViews",
                populate: {
                    path: "userId",
                    model: "users",
                    select: "name username profilePicture isVerified"
                }
            }
        }).skip(skip).limit(limit);

        return res.status(200).json({
            success: true,
            stories
        })

    } catch (e) {
        serverError(res, e);
    }

}
