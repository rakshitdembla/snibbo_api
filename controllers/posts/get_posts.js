import { Post } from "../../models/Post.js";
import { User } from "../../models/User.js";
import { serverError } from "../../utils/server_error_res.js";

export const getAllPosts = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find({}).populate({ path: "userId", model: "users", select: "username name profilePicture isVerified" }).skip(skip).limit(limit);
        return res.status(200).json({
            success: true,
            posts,
        });
    } catch (e) {
        serverError(res, e);
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const { userId } = req.userId;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await User.findById(userId).select("followings").populate({
            path: "followings",
            model: "users",
            select: "userPosts",
            populate: {
                path: "userPosts",
                model: "posts",
                populate: {
                    path: "userId",
                    model: "users",
                    select: "username name profilePicture isVerified"
                }
            }
        }).skip(skip).limit(limit);

        return res.status(200).json({
            success: true,
            posts,
        });
    } catch (e) {
        serverError(res, e);
    }
}