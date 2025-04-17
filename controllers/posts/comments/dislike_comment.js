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
                message: "Please provide a valid comment id"
            })
        }

        const comment = await Comment.findById(commentId).lean();

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found!"
            });
        }

        const like = await Comment.findByIdAndUpdate(commentId, {
            $pull: {
                commentLike: userId
            }
        }, {
            new: true
        });

        return res.status(202).json({
            success: true,
            message: "Comment like removed successfully",
            like
        });
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

        const reply = await Reply.findById(replyId).lean();

        if (!reply) {
            return res.status(404).json({
                success: false,
                message: "Reply not found!"
            });
        }

        const like = await Reply.findByIdAndUpdate(replyId, {
            $pull: {
                replyLikes: userId
            }
        }, {
            new: true
        });

        return res.status(202).json({
            success: true,
            message: "Reply like removed successfully",
            like
        });
    } catch (e) {
        serverError(res, e);

    }
}