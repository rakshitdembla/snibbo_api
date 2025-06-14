import mongoose from "mongoose";
import { serverError } from "../../../utils/server_error_res.js";
import { Comment } from "../../../models/Comment.js";
import { Post } from "../../../models/Post.js";
import { Reply } from "../../../models/Reply.js";

export const addComment = async (req, res) => {

    try {
        const userId = req.userId;
        const { commentContent } = req.body;
        const { postId } = req.params;

        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid post id."
            });
        }

        if (!commentContent) {
            return res.status(400).json({
                success: false,
                message: "Please provide comment content."
            });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found."
            });
        }

        const comment = await Comment.create({
            userId: userId,
            commentContent: commentContent,
        });

        post.postComments.push(comment._id);
        await post.save();

        const addedComment = comment.toObject();
        delete addedComment.userId;

        return res.status(201).json({
            success: true,
            message: "Comment added successfully.",
            addedComment
        });

    } catch (e) {
        serverError(res, e);
    }
}


export const addReply = async (req, res) => {

    try {
        const userId = req.userId;
        const { replyContent } = req.body;
        const { commentId } = req.params;

        if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid comment id."
            });
        }

        if (!replyContent) {
            return res.status(400).json({
                success: false,
                message: "Please provide reply-comment content."
            });
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }

        const reply = await Reply.create({
            userId: userId,
            replyContent: replyContent,
        });

        comment.commentReplies.push(reply._id);
        await comment.save();

        const addedReply = reply.toObject();
        delete addedReply.userId;

        return res.status(201).json({
            success: true,
            message: "Reply added successfully.",
            addedReply
        });

    } catch (e) {
        serverError(res, e);
    }

}