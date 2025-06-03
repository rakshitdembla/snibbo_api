import { Post } from "../../models/Post.js";
import { User } from "../../models/User.js";
import { Story } from "../../models/Story.js";
import { serverError } from "../../utils/server_error_res.js";
import { getUserEntity } from "../../utils/user_entity.js";
import { getFormattedPost } from "../../utils/post_entity.js";

export const getAllPosts = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const userId = req.userId;

        const currentUser = await User.findById(userId).select("savedPosts");

        const posts = await Post.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("userId", "username name profilePicture isVerified");

        const finalPosts = await Promise.all(
            posts.map(async (post) => {

                const postOwner = post.userId;
                const postOwnerId = postOwner._id;

                const stories = await Story.find({ userId: postOwnerId });

                const hasActiveStories = stories.length > 0;
                const isMyPost = userId == postOwnerId;

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

                return getFormattedPost(
                    post,
                    userEntity,
                    userId,
                    currentUser.savedPosts.includes(post._id)
                );
            })
        );


        return res.status(200).json({
            success: true,
            posts: finalPosts
        });
    } catch (e) {
        serverError(res, e);
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.userId;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const userFollowings = await User.findById(userId).select("followings").lean();
        const currentUser = await User.findById(userId).select("savedPosts");

        const posts = await Post.find({ userId: userFollowings.followings })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: "userId",
                model: "users",
                select: "username name profilePicture isVerified"
            });

        const finalPosts = await Promise.all(
            posts.map(async (post) => {
                const postOwner = post.userId;
                const postOwnerId = postOwner._id;

                const stories = await Story.find({ userId: postOwnerId });

                const hasActiveStories = stories.length > 0;
                const isMyPost = userId == postOwnerId;

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

                return getFormattedPost(
                    post,
                    userEntity,
                    userId,
                    currentUser.savedPosts.includes(post._id)
                );

            })
        );

        return res.status(200).json({
            success: true,
            posts: finalPosts
        });
    } catch (e) {
        serverError(res, e);
    }
}