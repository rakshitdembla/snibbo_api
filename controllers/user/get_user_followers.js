import { User } from "../../models/User.js";
import { serverError } from "../../utils/server_error_res.js";

export const getUserFollowers = async (req, res) => {
    try {
        const { username } = req.params;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const user = await User.findOne({
            username: username
        }).select("-_id followers").populate({
            path: "followers",
            model: "users",
            select: "-_id name username profilePicture isVerified"
        }).skip(skip).limit(limit);

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