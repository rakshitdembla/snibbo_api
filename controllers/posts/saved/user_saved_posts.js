import { Story } from "../../../models/Story.js";
import { User } from "../../../models/User.js";
import { serverError } from "../../../utils/server_error_res.js";
import { getFormattedPost } from "../../../utils/post_entity.js";
import { getUserEntity } from "../../../utils/user_entity.js";

export const getSavedPosts = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const { username } = req.params;
        const myId = req.userId;

        const currentUser = await User.findById(myId).select("savedPosts");

        const user = await User.findOne({ username })
            .select("username name profilePicture isVerified savedPosts _id")
            .populate({
                path: "savedPosts",
                options: { sort: { createdAt: -1 }, skip, limit },
                populate: {
                    path: "userId",
                    select: "username name profilePicture isVerified"
                }
            });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const userId = user._id;
        const posts = user.savedPosts;

        const savedPosts = await Promise.all(
            posts.map(async (post) => {
                const postOwner = post.userId;
                const postOwnerId = postOwner._id;

                const stories = await Story.find({ userId: postOwnerId });
                const hasActiveStories = stories.length > 0;

                const isMyPost = myId == postOwnerId;

                let isAllStoriesViewed = true;
                if (!isMyPost) {
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

                const userEntity = getUserEntity(
                    postOwner,
                    hasActiveStories,
                    isAllStoriesViewed
                );

                return getFormattedPost(
                    post,
                    userEntity,
                    myId,
                    currentUser.savedPosts.includes(post._id)
                );
            })
        );

        return res.status(200).json({
            success: true,
            posts: savedPosts
        });
    } catch (e) {
        serverError(res, e);
    }
};
