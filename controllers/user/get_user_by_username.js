import { User } from "../../models/User.js";
import mongoose from "mongoose";
import { serverError } from "../../utils/server_error_res.js";

export const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const userId = req.userId;

        const result = await User.findOne({ username: username }).select("-savedPosts -email -password -updatedAt -__v").populate([
            {
                path: "userStories",
                model: "stories",
                select: "username storyViews -_id"
            }
        ]);

        if (!result) {
            return res.status(400).json({
                success: false,
                message: "User not found."
            });
        }


        const userObj = result.toObject();
        const { userStories,followers,followings,userPosts,_id, ...userWithoutStories } = userObj;

        const hasActiveStories = userStories && userStories.length > 0;
        const userFollowers = followers.length;
        const userFollowing = followings.length;
        const posts = userPosts.length;
        const isFollowedByMe = followers.map(f => f.toString()).includes(userId.toString());
        const isMyProfile = _id == userId;
        let viewedAllStories = false;

        if (isMyProfile && hasActiveStories) {
            viewedAllStories = true
        } else {
        if (hasActiveStories) {
            viewedAllStories = userStories.every(story =>
                story.storyViews.includes(userId.toString())
            );
        }
        }


        return res.status(200).json({
            success: true,
            user: {
                ...userWithoutStories,
                posts,
                userFollowers,
                userFollowing,
                hasActiveStories,
                viewedAllStories,
                isFollowedByMe,
                isMyProfile
            }
        });

    } catch (e) {
        serverError(res, e);
    }

}