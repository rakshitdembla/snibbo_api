import mongoose from "mongoose";
import { serverError } from "../../../utils/server_error_res.js";
import { Comment } from "../../../models/Comment.js";
import { Post } from "../../../models/Post.js";
import { User } from "../../../models/User.js";
import { Story } from "../../../models/Story.js";
import { getUserEntity } from "../../../utils/user_entity.js";
import { getCommentEntity } from "../../../utils/comment_entity.js";
import { getreplyEntity } from "../../../utils/reply_entity.js";

export const getComments = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { postId } = req.params;
        const userId = req.userId;

        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid post id."
            })
        }

        const post = await Post.findById(postId).select("postComments").populate(
            "postComments"
        );
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found."
            });
        }

        const user = await User.findById(userId).lean();
        const userFollowings = user.followings.map(
            (id) => {
                return id.toString();
            }
        );

        const postComments = post.postComments;

        const sortedComments = postComments.sort((a, b) => {
            const aPriority = a.userId.toString() == user._id.toString() ? 0 : userFollowings.includes(a.userId.toString()) ? 1 : 2;
            const bPriority = b.userId.toString() == user._id.toString() ? 0 : userFollowings.includes(b.userId.toString()) ? 1 : 2;

            if (aPriority != bPriority) {
                return aPriority - bPriority;
            }

            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        const paginatedComments = sortedComments.slice(skip, skip + limit);

        const comments = await Promise.all(
            paginatedComments.map(
                async (comment) => {
                    const commentOwner =
                        await User.findById(comment.userId).lean();
                    const commentOwnerId = commentOwner._id;
                    const stories = await Story.find({
                        userId: commentOwnerId
                    });

                    const hasActiveStories = stories.length > 0;
                    let isAllStoriesViewed = hasActiveStories;
                    //Not my comment
                    if (commentOwnerId.toString() !== user._id.toString()) {
                        if (hasActiveStories) {
                            isAllStoriesViewed = true;

                            for (const story of stories) {
                                if (!story.storyViews.includes(user._id)) {
                                    isAllStoriesViewed = false;
                                    break;
                                }
                            }
                        }
                    }

                    const userEntity = getUserEntity(
                        commentOwner,
                        hasActiveStories,
                        isAllStoriesViewed
                    )

                    return getCommentEntity(
                        comment,
                        userEntity,
                        user
                    )
                }
            )
        );

        return res.status(200).json({
            success: true,
            comments,
        });


    } catch (e) {
        serverError(res, e);
    }

}

export const getReplies = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const { commentId } = req.params;

        const userId = req.userId;

        if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid comment id."
            })
        }

        const user = await User.findById(userId).lean();
        const userFollowings = user.followings.map(
            (id) => {
                return id.toString();
            }
        );

        const comment = await Comment.findById(commentId).select("commentReplies").populate("commentReplies");

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found."
            });
        }

        const commentReplies = comment.commentReplies;

        const sortedReplies = commentReplies.sort((a, b) => {
            const aPriority = a.userId.toString() == user._id.toString() ? 0 : userFollowings.includes(a.userId.toString()) ? 1 : 2;
            const bPriority = b.userId.toString() == user._id.toString() ? 0 : userFollowings.includes(b.userId.toString()) ? 1 : 2;

            if (aPriority != bPriority) {
                return aPriority - bPriority;
            }

            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        const paginatedReplies = sortedReplies.slice(skip, skip + limit);

        console.log(paginatedReplies);


        const replies = await Promise.all(
            paginatedReplies.map(
                async (reply) => {
                    const replyOwner =
                        await User.findById(reply.userId).lean();
                    console.log(replyOwner);
                    const replyOwnerId = replyOwner._id;
                    const stories = await Story.find({
                        userId: replyOwnerId
                    });

                    const hasActiveStories = stories.length > 0;
                    let isAllStoriesViewed = hasActiveStories;
                    //Not my reply
                    if (replyOwnerId.toString() !== user._id.toString()) {
                        if (hasActiveStories) {
                            isAllStoriesViewed = true;

                            for (const story of stories) {
                                if (!story.storyViews.includes(user._id)) {
                                    isAllStoriesViewed = false;
                                    break;
                                }
                            }
                        }
                    }
                    console.log("getuserentity");
                    const userEntity = getUserEntity(
                        replyOwner,
                        hasActiveStories,
                        isAllStoriesViewed
                    )
                    console.log("user entitiy is", userEntity);


                    return getreplyEntity(
                        reply,
                        userEntity,
                        user
                    )
                }
            )
        )

        return res.status(200).json({
            success: true,
            replies,
        });

    } catch (e) {
        serverError(res, e);
    }

}