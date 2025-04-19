import mongoose from "mongoose";
import { serverError } from "../../../utils/server_error_res.js";
import { Comment } from "../../../models/Comment.js";
import { Post } from "../../../models/Post.js";

export const getComments = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { postId } = req.params;

        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid post id."
            })
        }

        const comments = await Post.findById(postId).select("postComments -_id").populate({
            path: "postComments",
            model: "comments",
            options: {
                skip,
                limit
            },
            populate: [{
                path: "commentLike",
                model: "users",
                select: "-_id username"
            },

            {
                path: "userId",
                model: "users",
                select: "-_id name username profilePicture isVerified"
            },
            ]
        });

        if (!comments) {
            return res.status(404).json({
                success: false,
                message: "Post not found."
            });
        }

        return res.status(200).json({
            success: true,
            comments,
        });


    } catch (e) {
        serverError(res, e);
    }

}

export const getReplies = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const { commentId } = req.params;

        if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid comment id."
            })
        }

        const replies = await Comment.findById(commentId).select("-_id commentReplies").populate({
            path: "commentReplies",
            model: "replies",
            options: {
                skip,
                limit
            },
            populate: [
                {
                    path: "userId",
                    model: "users",
                    select: "-_id name username profilePicture isVerified",
                },
                {
                    path: "replyLikes",
                    model: "users",
                    select: "-_id username",
                },
            ],

        }).skip(skip).limit(limit);

        if (!replies) {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }

        return res.status(200).json({
            success: true,
            replies,
        });

    } catch (e) {
        serverError(res, e);
    }

}