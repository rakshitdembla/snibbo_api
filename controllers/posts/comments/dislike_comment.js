import { Comment } from "../../../models/Comment.js";
import { Reply } from "../../../models/Reply.js";
import { serverError } from "../../../utils/server_error_res.js";
import mongoose from "mongoose";

export const dislikeComment = async (req, res) => {
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

        if (comment.commentLike.includes(userId)) {
            comment.commentLike.pull(userId);
            await comment.save();

            return res.status(202).json({
                success: true,
                message: "Comment like removed successfully",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "You haven't liked this comment.",
            });
        }

    } catch (e) {
        serverError(res, e);

    }
}
export const dislikeReply = async (req, res) => {
    try {
        const { replyId } = req.params;
        const userId = req.userId;

        if (!replyId || !mongoose.Types.ObjectId.isValid(replyId)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid reply id"
            })
        }

        const reply = await Reply.findById(replyId);

        if (!reply) {
            return res.status(404).json({
                success: false,
                message: "Reply not found!"
            });
        }

        if (reply.replyLikes.includes(userId)) {
            reply.replyLikes.pull(userId);
            await reply.save();

            return res.status(202).json({
                success: true,
                message: "Reply like removed successfully",
            });

        } else {
            return res.status(400).json({
                success: false,
                message: "You've haven't liked this reply.",
            });
        }

    } catch (e) {
        serverError(res, e);

    }
}