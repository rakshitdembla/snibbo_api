import { Comment } from "../../../models/Comment.js";
import { Reply } from "../../../models/Reply.js";
import mongoose from "mongoose";
import { serverError } from "../../../utils/server_error_res.js";

export const removeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.userId;

        if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid comment id."
            })
        }

        const comment = await Comment.findById(commentId).lean();

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found!"
            });
        }

        if (comment.userId != userId) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized to remove this comment."
            });
        }

        await Comment.findByIdAndDelete(commentId);

        return res.status(202).json({
            success: true,
            message: "Comment removed successfully."
        });
    } catch (e) {
        serverError(res, e);

    }
}

export const removeReply = async(req,res) => {
    try {
        const { replyId } = req.params;
        const userId = req.userId;

        if (!replyId || !mongoose.Types.ObjectId.isValid(replyId)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid reply id."
            })
        }

        const reply = await Reply.findById(replyId).lean();

        if (!reply) {
            return res.status(404).json({
                success: false,
                message: "Reply not found!"
            });
        }

        if (reply.userId != userId) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized to remove this reply."
            });
        }

        await Reply.findByIdAndDelete(replyId);

        return res.status(202).json({
            success: true,
            message: "Reply removed successfully."
        });
    } catch (e) {
        serverError(res, e);
    }

}