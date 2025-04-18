import { Post } from "../../../models/Post.js";
import { User } from "../../../models/User.js";
import mongoose from "mongoose";
import { serverError } from "../../../utils/server_error_res.js";

export const removeSavedPost = async (req, res) => {
    try {
        const userId = req.userId;
        const { postId } = req.params;

        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post id provided."
            });
        }

        const post = await Post.findById(postId).lean();

        if (!post) {
            return res.status(400).json({
                success: false,
                message: "Post not found."
            })
        }

        await User.findByIdAndUpdate(userId, {
            $pull: {
                savedPosts: postId
            }
        });

        return res.status(201).json({
            success: true,
            message: "Post removed from saved-posts successfully."
        });

    } catch (e) {
        serverError(res, e);
    }
}