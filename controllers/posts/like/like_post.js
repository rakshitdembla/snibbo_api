import { Post } from "../../../models/Post.js";
import mongoose from "mongoose";
import { serverError } from "../../../utils/server_error_res.js";

export const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.userId;

        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid post id"
            })
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found!"
            });
        }

        if (!post.postLikes.includes(userId)) {
            post.postLikes.push(userId);

            await post.save();

            return res.status(202).json({
                success: true,
                message: "Post liked successfully",
            });

        } else {
            return res.status(400).json({
                success: false,
                message: "You've already liked this post.",
            });
        }

    } catch (e) {
        serverError(res, e);
    }
}