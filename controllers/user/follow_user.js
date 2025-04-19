import { User } from "../../models/User.js";
import { serverError } from "../../utils/server_error_res.js";

export const followUser = async (req, res) => {
    try {

        const userId = req.userId;
        const { username } = req.params;

        const userToFollow = await User.findOne({ username: username });
        const currentUser = await User.findById(userId);

        if (!userToFollow) {
            return res.status(400).json({
                success: false,
                message: "User not found."
            });
        }

        if (userToFollow._id.equals(userId)) {
            return res.status(400).json({
                success: true,
                message: "You can't follow yourself."
            })
        }

        if (!userToFollow.followers.includes(userId)) {
          userToFollow.followers.push(userId);
          currentUser.followings.push(userToFollow._id);

            await userToFollow.save();
            await currentUser.save();

            res.status(202).json({
                success: true,
                message: 'User followed successfully'
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: 'Already following this user.'
            });
        }

    } catch (e) {
        serverError
    }
}