import mongoose from "mongoose";
import { Post } from "../../models/Post.js";
import { serverError } from "../../utils/server_error_res.js";

export const updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { captions } = req.body;
    
        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid post id"
            })
        }
        
        const post = await Post.findById(postId);
        const contentCaptions = captions || post.postCaption;

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found!"
            });
        }

        const postUserId = post.userId;
        if (req.userId != postUserId) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized to update this post."
            });
        }

        post.postCaption = contentCaptions;
        await post.save();

        const updatedPost = post.toObject();
        delete updatedPost.userId;

        return res.status(202).json({
            success: true,
            message: "Post updated successfully!",
            updatedPost         
        });

    } catch (e) {
        serverError(res, e);
    }

}