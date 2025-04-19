import { Post } from "../../../models/Post.js";
import { User } from "../../../models/User.js";
import mongoose from "mongoose";
import { serverError } from "../../../utils/server_error_res.js";

export const savePost = async (req, res) => {
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
            });
        }
       
        const user = await User.findById(userId);

        if (!user.savedPosts.includes(postId)) {

            user.savedPosts.push(postId);
            await user.save();

            return res.status(202).json({
                success: true,
                message: "Post saved successfully.",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Saved posts already contains this post.",
            });
        }


    } catch (e) {
        serverError(res, e);
    }
}