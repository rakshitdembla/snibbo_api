import { Post } from "../../models/Post.js";
import { User } from "../../models/User.js";
import { serverError } from "../../utils/server_error_res.js";

export const createPost = async (req, res) => {
    try {
        const userId = req.userId;
        const { content, captions,contentType } = req.body;
        const postCaption = captions ?? null;

        if (!content || !contentType) {
            return res.status(400).json({
                success: false,
                message: "Please provide post content & its type."
            });
        }
        const createPost = await Post.create({
            userId: userId,
            postContent: content,
            postCaption: postCaption,
            contentType : contentType
        });

        await User.findByIdAndUpdate(userId, {
            $addToSet: {
                userPosts: createPost._id
            }
        });

        const post = createPost.toObject();
        delete post.userId;

        const userStories = await User.findByIdAndUpdate(userId, {
            $addToSet: {
                userPosts: createPost._id
            }
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