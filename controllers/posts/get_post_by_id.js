import { Post } from "../../models/Post.js";
import { User } from "../../models/User.js";
import { Story } from "../../models/Story.js";
import { serverError } from "../../utils/server_error_res.js";
import { getUserEntity } from "../../utils/user_entity.js";
import { getFormattedPost } from "../../utils/post_entity.js";

export const getPostById = async (req, res) => {
    try {
        const userId = req.userId;
        const { postId } = req.params;

        const currentUser = await User.findById(userId);

        const post = await Post.findById(postId)
            .populate("userId", "username name profilePicture isVerified");

        const postOwner = post.userId;
        const postOwnerId = postOwner._id;

        const stories = await Story.find({ userId: postOwnerId });

        const hasActiveStories = stories.length > 0;
        const isMyPost = userId.toString() == postOwnerId.toString();

        let isAllStoriesViewed = true;
        if (!isMyPost) {
            if (hasActiveStories) {
                for (const story of stories) {
                    if (!story.storyViews.includes(userId)) {
                        isAllStoriesViewed = false;
                        break;
                    }
                }
            } else {
                isAllStoriesViewed = false;
            }
        }

        const userEntity = getUserEntity(
            postOwner,
            hasActiveStories,
            isAllStoriesViewed
        );

        const formattedPost = getFormattedPost(
            post,
            userEntity,
            userId,
            currentUser.savedPosts.includes(post._id)
        );


        return res.status(200).json({
            success: true,
            post: formattedPost
        });
    } catch (e) {
        serverError(res, e);
    }
}
