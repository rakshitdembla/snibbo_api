import mongoose from "mongoose";
import { User } from "../../models/User.js";
import { serveError, serverError } from "../../utils/server_error_res.js";

export const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username: username }).select("-_id -savedPosts").populate([
            {
                path: "followers",
                model: "users",
                select: "-_id username"
            },
            {
                path: "followings",
                model: "users",
                select: "-_id username"
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