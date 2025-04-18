import { User } from "../../models/User.js";
import { serverError } from "../../utils/server_error_res.js";

export const unfollowUser = async (req, res) => {
    try {

        const userId = req.userId;
        const { username } = req.params;

        const userToUnfollow = await User.findOne({ username: username });
        const currentUser = await User.findById(userId);

        if (!userToUnfollow) {
            return res.status(400).json({
                success: false,
                message: "User not found."
            });
        }

        if (userToUnfollow.followers.includes(userId)) {
            userToUnfollow.followers.pull(userId);
            currentUser.followings.pull(userToUnfollow._id);

            await userToUnfollow.save();
            await currentUser.save();

            res.status(200).json({
                success: true,
                message: 'User Unfollowed successfully'
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: "You don't follow this user."
            });
        }

    } catch (e) {
        serverError
    }
}