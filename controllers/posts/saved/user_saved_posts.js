import { User } from "../../../models/User.js";
import { serverError } from "../../../utils/server_error_res.js";

export const getSavedPosts = async (req, res) => {
    try { 

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const userId = req.userId;

        const savedPosts = await User.findById(userId).select("savedPosts -_id").populate({
            path: "savedPosts",
            model: "posts",
            populate: [
                {
                    path: "userId",
                    model: "users",
                    select: "-_id name username profilePicture isVerified"
                },
                {
                    path: "postLikes",
                    model: "users",
                    select: "-_id username"
                }
            ]
        }).skip(skip).limit(limit);

        return res.status(200).json({
            success: true,
            savedPosts
        });
     } catch (e) {
        serverError(res, e);
    }

}