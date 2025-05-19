import { User } from "../../models/User.js";
import { serverError } from "../../utils/server_error_res.js";

export const getUserStories = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username: username }).select("-_id name username createdAt isVerified profilePicture userStories").populate({
            path: "userStories",
            model: "stories",
            select: "-userId",
            populate: {
                path: "storyViews",
                model: "users",
                select: "-_id username"
            }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found by this username."
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (e) {
        serverError(res, e);
    }
}