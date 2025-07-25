import { User } from "../../models/User.js";
import { serverError } from "../../utils/server_error_res.js";
import { getFullUserEntity } from "../../utils/full_user_entity.js";

export const searchUser = async (req, res) => {
    try {
        const { username } = req.params;
        const userId = req.userId;
        const limit = Number(req.query.limit) || 4;

        const findUsers = await User.find({
            username: {
                $regex: new RegExp("^" + username, "i")
            }
        }).populate("userStories").limit(limit);

        if (findUsers.length == 0) {
            return res.status(200).json({
            success: true,
            users: []
        }); 
        }

        const users = findUsers.map((user) => {
            const hasActiveStories = user.userStories.length > 0;
            let isAllStoriesViewed = hasActiveStories;
            const isMySelf = user._id.toString() === userId.toString();

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
            users: users
        });

    } catch (e) {
        serverError(res, e);
    }
}