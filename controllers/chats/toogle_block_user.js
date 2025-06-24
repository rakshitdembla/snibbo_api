import mongoose from "mongoose";
import { User } from "../../models/User.js";
import { serverError } from "../../utils/server_error_res.js";

export const blockUser = async (req, res) => {
    try {
        const userId = req.userId;
        const { username } = req.params;

        const user = await User.findOne({
            username: username
        }).lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User doesn't exists"
            });
        }

        if (userId == user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You can't block yourself."
            })
        }

        const currentUser = await User.findById(userId);
        const alreadyBlocked = (currentUser.blockedUsers || []).includes(new mongoose.Types.ObjectId(user._id));

        if (alreadyBlocked) {
            return res.status(400).json({
                success: false,
                message: "User is already blocked by you."
            });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            $push: {
                blockedUsers: user._id
            }
        },
            {
                new: true
            }).lean();

        if (updatedUser) {
            return res.status(202).json({
                success: true,
                message: "User blocked successfully."

            })

        } else {
            return res.status(403).json({
                success: false,
                message: "Failed to bloc user. Something went wrong."
            });

        }

    } catch (e) {
        serverError(res, e);
    }
}

export const unblockUser = async (req, res) => {
    try {
        const userId = req.userId;
        const { username } = req.params;

        const user = await User.findOne({
            username: username
        }).lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User doesn't exists"
            });
        }

        if (userId == user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You can't unblock yourself."
            })
        }


        const currentUser = await User.findById(userId);
        const alreadyBlocked = (currentUser.blockedUsers || []).includes(new mongoose.Types.ObjectId(user._id));

        if (!alreadyBlocked) {
            return res.status(400).json({
                success: false,
                message: "You haven't blocked this user."
            });
        }
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $pull: {
                blockedUsers: user._id
            }
        },
            {
                new: true
            }).lean();

        if (updatedUser) {
            return res.status(202).json({
                success: true,
                message: "User un-blocked successfully."

            })

        } else {
            return res.status(403).json({
                success: false,
                message: "Failed to bloc user. Something went wrong."
            });
        }

    } catch (e) {
        serverError(res, e);
    }
}