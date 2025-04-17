import mongoose from "mongoose";
import { serverError } from "../../../utils/server_error_res.js";
import {Comment} from "../../../models/Comment.js";
import {Post} from "../../../models/Post.js";
import { Reply } from "../../../models/Reply.js";

export const addComment = async (req, res) => {

    try {       
        const userId = req.userId;
        const {commentContent} = req.body;
        const {postId} = req.params;
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

            const checkPost = await Post.findById(postId).lean();

            if (!checkPost) {
                return res.status(404).json({
                    success: false,
                    message: "Post not found."
                });
            }

            const comment = await Comment.create({
                userId: userId,
                commentContent: commentContent,
            });

            await Post.findByIdAndUpdate(postId,{
                $addToSet: {
                    postComments: comment._id
                }
            },{
                new: true
            });

            return res.status(201).json({
                success: true,
                message: "Comment added successfully.",
                comment
            });



        } catch(e) {
                serverError(res,e);
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

        const checkComment = await Comment.findById(commentId).lean();

        if (!checkComment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }

        const reply = await Reply.create({
            userId: userId,
            replyContent: replyContent,
        });

        await Comment.findByIdAndUpdate(commentId, {
            $addToSet: {
                commentReplies: reply._id
            }
        }, {
            new: true
        });

        return res.status(201).json({
            success: true,
            message: "Reply added successfully.",
            reply
        });



    } catch (e) {
        serverError(res, e);
    }

}