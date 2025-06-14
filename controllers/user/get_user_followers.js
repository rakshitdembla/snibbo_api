import { User } from "../../models/User.js";
import { Story } from "../../models/Story.js";
import { serverError } from "../../utils/server_error_res.js";
import { getFullUserEntity } from "../../utils/full_user_entity.js";

export const getUserFollowers = async (req, res) => {
    try {
        const { username } = req.params;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const userId = req.userId;

        const user = await User.findOne({
            username: username
        }).select("_id followers").populate({
            path: "followers",
            model: "users",
            select: "_id name username profilePicture isVerified userStories",
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found."
            });
        }

        const currentUser = await User.findById(userId);
        const currentUserFollowers = currentUser.followings.map((id) => id.toString());

      const sortedFollowers =  user.followers.sort((a,b) => {
            const aPriority =  currentUser._id.toString() == a._id.toString() ? 0 :  currentUserFollowers.includes(a._id.toString()) ? 1 : 2;
            const bPriority =  currentUser._id.toString() == b._id.toString() ? 0 : currentUserFollowers.includes(b._id.toString()) ? 1 : 2;

                return aPriority - bPriority;
            
        });

        const paginatedFollowers = sortedFollowers.slice(skip,skip + limit);

        const users = await Promise.all(
         paginatedFollowers.map(
          async  (follower) => {
                const isMySelf = follower._id.toString() === currentUser._id.toString();
                                const isFollowedByMe = currentUser.followings
                    .map(id => id.toString())
                    .includes(follower._id.toString());
                const stories = await Story.find({userId : follower._id});
                const hasActiveStories = stories.length > 0;

                let isAllStoriesViewed = hasActiveStories;

                if (!isMySelf) {
                    if (hasActiveStories) {
                        for (const story of stories) {
                            if (!story.storyViews.includes(currentUser._id)){
                                isAllStoriesViewed = false;
                                break;
                            }
                        }
                    }
                }

                return getFullUserEntity(
                    follower,
                    hasActiveStories,
                    isAllStoriesViewed,
                    isMySelf,isFollowedByMe
                )
            }
        )

        );


        return res.status(200).json({
            success: true,
            users
        });

    } catch (e) {
        serverError(res, e);
    }

}