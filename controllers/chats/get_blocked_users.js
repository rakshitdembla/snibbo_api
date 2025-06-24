import { User } from "../../models/User.js";
import { serverError } from "../../utils/server_error_res.js";

export const getBlockedUsers = async (req, res) => {
    try {
        const userId = req.userId;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.findById(userId).select("-_id blockedUsers").populate({
            path: "blockedUsers",
            model: "users",
            select: "name username profilePicture isVerified -_id",
            options: {
                skip: skip,
                limit: limit
            }
        }).lean();

        return res.status(200).json({
            success: true,
            blockedUsers: users.blockedUsers
        })
    } catch (e) {
        serverError(res, e);
    }
}