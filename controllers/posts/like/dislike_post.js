import { Post } from "../../../models/Post.js";
import mongoose from "mongoose";
import { serverError } from "../../../utils/server_error_res.js";

export const dislikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.userId;

        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid post id"
            })
        }

        const post = await Post.findById(postId).lean();

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found!"
            });
        }

        const like = await Post.findByIdAndUpdate(postId, {
            $pull: { postLikes: userId }

        }, {
            new: true
        });

        return res.status(202).json({
            success: true,
            message: "Post's like removed successfully",
            like
        });
    } catch (e) {
        serverError(res, e);

    }
}