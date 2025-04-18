import { User } from "../../models/User.js";
import { serverError } from "../../utils/server_error_res.js";

export const getUserFollowings = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({
            username: username
        }).select("-_id followings").populate({
            path: "followings",
            model: "users",
            select: "-_id name username profilePicture isVerified"
        });

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