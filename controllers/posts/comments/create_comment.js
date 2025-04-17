import mongoose from "mongoose";
import { serverError } from "../../../utils/server_error_res.js";
import {Comment} from "../../../models/Comment.js";
import {Post} from "../../../models/Post.js";

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