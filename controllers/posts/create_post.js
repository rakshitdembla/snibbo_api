import { Post } from "../../models/Post.js";
import { serverError } from "../../utils/server_error_res.js";

export const createPost = async (req, res) => {
    try {
        const userId = req.userId;
        const { content, captions } = req.body;
        const postCaption = captions ?? null;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Please provide post content."
            });
        }
        const post = await Post.create({
            userId: userId,
            postContent: content,
            postCaption: postCaption
        });

        return res.status(201).json({
            success: true,
            message: "Post created successfully!",
            post
        });
    } catch (e) {
        serverError(res, e);
    }

}