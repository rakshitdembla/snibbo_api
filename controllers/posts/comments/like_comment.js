import { Comment } from "../../../models/Comment.js";
import { Reply } from "../../../models/Reply.js";
import { serverError } from "../../../utils/server_error_res.js";
import mongoose from "mongoose";

export const likeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.userId;

        if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid comment id."
            })
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }
      
        if (!comment.commentLike.includes(userId)) {
            comment.commentLike.push(userId);
            await comment.save();

            return res.status(202).json({
                success: true,
                message: "Comment liked successfully.",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "You've already liked this comment.",
            });
        }

    } catch (e) {
        serverError(res, e);

    }
};

export const likeReply = async (req, res) => {
    try {
        const { replyId } = req.params;
        const userId = req.userId;

        if (!replyId || !mongoose.Types.ObjectId.isValid(replyId)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid reply id."
            })
        }

        const reply = await Reply.findById(replyId);

        if (!reply) {
            return res.status(404).json({
                success: false,
                message: "Reply not found."
            });
        }
  
        if (!reply.replyLikes.includes(userId)) {
            reply.replyLikes.push(userId);
            await reply.save();

            return res.status(202).json({
                success: true,
                message: "Reply liked successfully.",
            });

        } else {
            return res.status(400).json({
                success: false,
                message: "You've already liked this reply.",
            });
        }

    } catch (e) {
        serverError(res, e);

    }
}