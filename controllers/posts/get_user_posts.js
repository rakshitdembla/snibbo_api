import { User } from "../../models/User.js";
import { Story } from "../../models/Story.js";
import { serverError } from "../../utils/server_error_res.js";
import { getUserEntity } from "../../utils/user_entity.js";
import { getFormattedPost } from "../../utils/post_entity.js";

export const getUserPosts = async (req, res) => {
    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        const { username } = req.params;
        const myId = req.userId;

        const currentUser = await User.findById(myId).select("savedPosts");
        const user = await User.findOne({ username }).select("username name profilePicture isVerified userPosts _id").populate(({
            path: "userPosts",
            options: { sort: { createdAt: -1 }, skip, limit },
        }));
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const userId = user._id;

        const result = user.userPosts;

        const isMyPosts = myId == userId;

        const stories = (await Story.find({ userId: userId }));
        const hasActiveStories = stories.length > 0;
        let isAllStoriesViewed = true;
        if (!isMyPosts) {
            if (hasActiveStories) {

                for (const story of stories) {
                    if (!story.storyViews.includes(myId)) {
                        isAllStoriesViewed = false;
                        break;
                    }
                }
            } else {
                isAllStoriesViewed = false;
            }

        } else {
            isAllStoriesViewed = hasActiveStories;
        }


        const savedPosts =
            result.map((post) => {

                const userEntity = getUserEntity(
                    user,
                    hasActiveStories,
                    isAllStoriesViewed
                );

                return getFormattedPost(
                    post,
                    userEntity,
                    myId,
                    currentUser.savedPosts.includes(post._id)
                );
            });

        return res.status(200).json({
            success: true,
            posts: savedPosts
        });

    } catch (e) {
        serverError(res, e);
    }

}