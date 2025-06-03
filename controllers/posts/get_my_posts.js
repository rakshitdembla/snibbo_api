import { User } from "../../models/User.js";
import { Story } from "../../models/Story.js";
import { serverError } from "../../utils/server_error_res.js";
import { getUserEntity } from "../../utils/user_entity.js";
import { getFormattedPost } from "../../utils/post_entity.js";

export const getMyPosts = async (req, res) => {
    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const userId = req.userId;
        const currentUser = await User.findById(userId).select("savedPosts");

        const user = await User.findById(userId).select("username name profilePicture isVerified userPosts -_id").populate(({
            path: "userPosts",
            options: { sort: { createdAt: -1 }, skip, limit },
        }));

        const result = user.userPosts;

        const hasActiveStories = (await Story.find({ userId: userId })).length > 0;
        const isAllStoriesViewed = hasActiveStories;

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
                    userId,
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