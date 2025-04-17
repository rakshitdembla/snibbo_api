import mongoose from "mongoose";
import { serverError } from "../../../utils/server_error_res.js";
import { Comment } from "../../../models/Comment.js";
import {Reply} from "../../../models/Reply.js";

export const commentLikedUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { commentId } = req.params;

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
                message: "Comment not found."
            });
        }

        const likedUsers = await Comment.findById(commentId).select("commentLike -_id").populate({
            path: "commentLike",
            model: "users",
            select: "name username isVerified profilePicture"
        }).skip(skip).limit(limit);

        return res.status(200).json({
            success: true,
            likedUsers,
        });

    } catch (e) {
        serverError(res, e);
    }

}
export const replyLikedUsers = async (req, res) => {
    try { 
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { replyId } = req.params;

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
                message: "Reply not found."
            });
        }

        const likedUsers = await Reply.findById(replyId).select("replyLikes -_id").populate({
            path: "replyLikes",
            model: "users",
            select: "name username isVerified profilePicture"
        }).skip(skip).limit(limit);

        return res.status(200).json({
            success: true,
            likedUsers,
        });
    } catch (e) {
        serverError(res, e);
    }

}