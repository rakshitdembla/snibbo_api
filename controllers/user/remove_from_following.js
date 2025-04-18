import { User } from "../../models/User.js";
import { serverError } from "../../utils/server_error_res.js";

export const removeFromFollowing = async (req, res) => {
    try {
        const userId = req.userId;
        const {username} = req.params;

        const currentUser = await User.findById(userId);
        const userToRemove = await User.findOne({username: username});

        if (!userToRemove) {
            return res.status(400).json({
                success: false,
                message: "User not found."
            });
        }

        if (currentUser.followers.includes(userToRemove)) {
            currentUser.followers.pull(userToRemove._id);
            userToRemove.followings.pull(userId);

            await currentUser.save();
            await userToRemove.save();

            res.status(202).json({
                success: true,
                message: 'User removed from followers successfully.'
            });

        } else {
            res.status(400).json({
                success: false,
                message: "User doesn't follow you"
            });

        }
     } catch (e) {
        serverError(res, e);
    }
}