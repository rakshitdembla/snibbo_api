import { User } from "../../models/User.js";
import { serverError } from "../../utils/server_error_res.js";

export const getMyStories = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).select(" -_id username name profilePicture isVerified userStories createdAt").populate({
            path: "userStories",
            model: "stories",
            select: "-userId",
        });

        return res.status(200).json({
            success: true,
            user
        });
    } catch (e) {
        serverError(res, e)
    }
}