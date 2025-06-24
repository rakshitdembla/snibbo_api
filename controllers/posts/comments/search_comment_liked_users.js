import { User } from "../../../models/User.js";
import { Comment } from "../../../models/Comment.js";
import { Reply } from "../../../models/Reply.js";
import { serverError } from "../../../utils/server_error_res.js";
import { getFullUserEntity } from "../../../utils/full_user_entity.js";

export const searchCommentLikedUsers = async (req, res) => {
    try {
        const userId = req.userId;
        const { commentId, username } = req.params;
        const limit = Number(req.query.limit) || 4;

        const comment = await Comment.findById(commentId).lean();

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        const commentLikedUsers = comment.commentLike;
        const regex = new RegExp("^" + username, "i");

        const findUsers = await User.find({
            _id: { $in: commentLikedUsers },
            username:
            {
                $regex: regex
            }

        }).populate("userStories").limit(limit);

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
            users
        });

    } catch (e) {
        serverError(res, e);
    }
}

export const searchReplyLikedUsers = async (req, res) => {
    try {
        const userId = req.userId;
        const { replyId, username } = req.params;
        const limit = Number(req.query.limit) || 4;

        const reply = await Reply.findById(replyId).lean();

        if (!reply) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        const replyLikedUsers = reply.replyLikes;
        const regex = new RegExp("^" + username, "i");

        const findUsers = await User.find({
            _id: { $in: replyLikedUsers },
            username:
            {
                $regex: regex
            }

        }).populate("userStories").limit(limit);

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
            users
        });

    } catch (e) {
        serverError(res, e);
    }
}