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

        const likedUsers = await Comment.findById(commentId).select("commentLike").populate({
            path: "commentLike",
            model: "users",
            options: {
                skip,
                limit
            },
            select: "-_id name username isVerified profilePicture"
        });

        if (!likedUsers) {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }

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

        const likedUsers = await Reply.findById(replyId).select("replyLikes -_id").populate({
            path: "replyLikes",
            model: "users",
            options: {
                skip,
                limit
            },
            select: "-_id name username isVerified profilePicture"
        });

        if (!likedUsers) {
            return res.status(404).json({
                success: false,
                message: "Reply not found."
            });
        }

        return res.status(200).json({
            success: true,
            likedUsers,
        });

    } catch (e) {
        serverError(res, e);
    }

}