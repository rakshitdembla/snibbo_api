import { User } from "../../models/User.js";
import mongoose from "mongoose";
import { serverError } from "../../utils/server_error_res.js";

export const getUserProfile = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { username } = req.params;

        const user = await User.findOne({ username: username }).select("-_id -savedPosts -email -password -updatedAt -__v").populate([
            {
                path: "followers",
                model: "users",
                select: "-_id username"
            },
            {
                path: "followings",
                model: "users",
                select: "-_id username"
            },
            {
                path: "userPosts",
                options: {
                    skip,
                    limit
                },
                model: "posts",
                select: "-userId",
                populate:
                {
                    path: "postLikes",
                    model: "users",
                    select: "-_id username"
                },

            }
        ]);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (e) {
        serverError(res, e);
    }

}