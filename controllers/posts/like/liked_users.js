import { Post } from "../../../models/Post.js";
import { serverError } from "../../../utils/server_error_res.js";
import mongoose from "mongoose";

export const likedUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { postId } = req.params;

        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid post id"
            });
        }

        const users = await Post.findById(postId).select("postLikes -_id").populate({
            path: "postLikes",
            model: "users",
            options: {
                skip,
                limit
            },
            select: "-_id username name profilePicture isVerified"
        });

        
        if (!users) {
            return res.status(404).json({
                success: false,
                message: "Post not found!"
            });
        }

        return res.status(200).json({
            success: true,
            users
        });

    } catch (e) {
        serverError(res, e);
    }
}