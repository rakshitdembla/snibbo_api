import { Post } from "../../../models/Post.js";
import { Story } from "../../../models/Story.js";
import { User } from "../../../models/User.js";
import { serverError } from "../../../utils/server_error_res.js";
import mongoose from "mongoose";
import { getFullUserEntity } from "../../../utils/full_user_entity.js"

export const likedUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { postId } = req.params;
        const userId = req.userId;

        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid post id"
            });
        }

        const post = await Post.findById(postId)
            .select("postLikes -_id")
            .populate({
                path: "postLikes",
                model: "users",
                select: "_id name username profilePicture isVerified userStories"
            });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found!"
            });
        }

        const currentUser = await User.findById(userId);
        const currentUserFollowers = currentUser.followings.map((id) => id.toString());

        const sortedLikes = post.postLikes.sort((a, b) => {
            const aPriority =  currentUser._id.toString() == a._id.toString() ? 0 : currentUserFollowers.includes(a._id.toString()) ? 1 : 2;
            const bPriority = currentUser._id.toString() == b._id.toString() ? 0 : currentUserFollowers.includes(b._id.toString()) ? 1 : 2;
            return aPriority - bPriority;
        });

        const paginatedLikes = sortedLikes.slice(skip, skip + limit);

        const users = await Promise.all(
            paginatedLikes.map(async (likedUser) => {
                const isFollowedByMe = currentUser.followings
                    .map(id => id.toString())
                    .includes(likedUser._id.toString());

                const isMySelf = likedUser._id.toString() === currentUser._id.toString();

                const stories = await Story.find({ userId: likedUser._id });
                const hasActiveStories = stories.length > 0;

                let isAllStoriesViewed = hasActiveStories;

                if (!isMySelf && hasActiveStories) {
                    for (const story of stories) {
                        if (!story.storyViews.includes(currentUser._id)) {
                            isAllStoriesViewed = false;
                            break;
                        }
                    }
                }

                return getFullUserEntity(
                    likedUser,
                    hasActiveStories,
                    isAllStoriesViewed,
                    isMySelf,
                    isFollowedByMe
                );
            })
        );

        return res.status(200).json({
            success: true,
            users
        });

    } catch (e) {
        serverError(res, e);
    }
};
