import {Post} from "../../models/Post.js";
import {serverError} from "../../utils/server_error_res.js";
import mongoose from "mongoose";

export const deletePost = async(req,res) => {
    const {postId} = req.params;

    if (!postId|| !mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid post id"
        })
    }

    try {
    const post = await Post.findById(postId).lean();

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
            message: "You are not authorized to delete this post."
        });
    }    
    const deletePost = await Post.findByIdAndDelete(postId);

    return res.status(202).json({
        success: true,
        message: "Post deleted successfully!"
    });

} catch(e) {
        serverError(res,e);
    }

}