import { Post } from "../../models/Post.js";
import { User } from "../../models/User.js";
import { serverError } from "../../utils/server_error_res.js";

export const getAllPosts = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find({}).skip(skip).limit(limit).populate({ path: "userId", model: "users", select: "-_id username name profilePicture isVerified" });
        return res.status(200).json({
            success: true,
            posts,
        }).sort({ createdAt: -1 });
    } catch (e) {
        serverError(res, e);
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.userId;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const userFollowings = await User.findById(userId).select("followings").lean();


        const posts = await Post.find({ userId: userFollowings.followings })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: "userId",
                model: "users",
                select: "-_id username name profilePicture isVerified"
            });

        return res.status(200).json({
            success: true,
            posts,
        });
    } catch (e) {
        serverError(res, e);
    }
}