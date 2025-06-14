import mongoose from "mongoose";
import { serverError } from "../../../utils/server_error_res.js";
import { Comment } from "../../../models/Comment.js";
import { Reply } from "../../../models/Reply.js";
import { User } from "../../../models/User.js";
import { Story } from "../../../models/Story.js";
import { getFullUserEntity } from "../../../utils/full_user_entity.js";

export const commentLikedUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { commentId } = req.params;
        const userId = req.userId;

        if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid comment id."
            });
        }

        const comment = await Comment.findById(commentId)
            .select("commentLike -_id")
            .populate({
                path: "commentLike",
                model: "users",
                select: "_id name username profilePicture isVerified userStories"
            });

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }

        const currentUser = await User.findById(userId);
        const currentUserFollowers = currentUser.followings.map((id) => id.toString());

        const sortedLikes = comment.commentLike.sort((a, b) => {
            const aPriority = currentUser._id.toString() == a._id.toString() ? 0 : currentUserFollowers.includes(a._id.toString()) ? 1 : 2;
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
            users,
        });

    } catch (e) {
        serverError(res, e);
    }
};

export const replyLikedUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { replyId } = req.params;
        const userId = req.userId;

        if (!replyId || !mongoose.Types.ObjectId.isValid(replyId)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid reply id."
            });
        }

        const reply = await Reply.findById(replyId)
            .select("replyLikes -_id")
            .populate({
                path: "replyLikes",
                model: "users",
                select: "_id name username profilePicture isVerified userStories"
            });

        if (!reply) {
            return res.status(404).json({
                success: false,
                message: "Reply not found."
            });
        }

        const currentUser = await User.findById(userId);
        const currentUserFollowings = currentUser.followings.map(id => id.toString());

        const sortedLikes = reply.replyLikes.sort((a, b) => {
            const aPriority = currentUser._id.toString() == a._id.toString() ? 0 : currentUserFollowings.includes(a._id.toString()) ? 1 : 2;
            const bPriority = currentUser._id.toString() == b._id.toString() ? 0 : currentUserFollowings.includes(b._id.toString()) ? 1 : 2;
            return aPriority - bPriority;
        });

        const paginatedLikes = sortedLikes.slice(skip, skip + limit);

        const users = await Promise.all(
            paginatedLikes.map(async (likedUser) => {
                const isFollowedByMe = currentUserFollowings.includes(likedUser._id.toString());
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
