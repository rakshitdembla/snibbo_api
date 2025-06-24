import { User } from "../../models/User.js";
import { serverError } from "../../utils/server_error_res.js";
import { getFullUserEntity } from "../../utils/full_user_entity.js";

export const searchFollower = async (req, res) => {
    try {
        const { username, userToSearch } = req.params;
        const userId = req.userId;
        const limit = Number(req.query.limit) || 4;

        const user = await User.findOne({ username: username }).select("followers").lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const followerIds = user.followers || [];

        if (followerIds.length === 0) {
            return res.status(200).json({
                success: true,
                users: []
            });
        }

        const regex = new RegExp("^" + userToSearch, "i");

        const findUsers = await User.find({
            _id: {
                $in: followerIds
            },
            username: {
                $regex: regex
            }
        }).populate("userStories").limit(limit);

        const users = findUsers.map((user) => {
            const hasActiveStories = user.userStories.length > 0;
            const isMySelf = user._id.toString() === userId.toString();
            let isAllStoriesViewed = hasActiveStories;

            if (hasActiveStories && !isMySelf) {
                for (const story of user.userStories) {
                    const storyViews = story.storyViews.map((_id) => _id.toString());

                    if (!storyViews.includes(userId.toString())) {
                        isAllStoriesViewed = false;
                        break;
                    }
                }
            }

            const isFollowedByMe = user.followers.map((_id) => _id.toString()).includes(userId.toString());

            return getFullUserEntity(
                user,
                hasActiveStories,
                isAllStoriesViewed,
                isMySelf,
                isFollowedByMe

            );
        });



        return res.status(200).json({
            success: true,
            users
        })

    } catch (e) {
        serverError(res, e);
    }
}