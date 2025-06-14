import { User } from "../../models/User.js";
import { serverError } from "../../utils/server_error_res.js";

export const searchUser = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username: username }).select("-_id username name profilePicture isVerified");

        return res.status(200).json({
            success: true,
            user
        });

    } catch (e) {
        serverError(res, e);
    }
}