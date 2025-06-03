export const getFormattedPost = (post, userEntity, currentUserId, isSavedByMe) => {
    return {
        _id: post._id,
        userId: userEntity,
        postContent: post.postContent,
        contentType: post.contentType,
        postCaption: post.postCaption,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        likesLength: post.postLikes.length,
        commentsLength: post.postComments.length,
        isLikedByMe: post.postLikes.includes(currentUserId),
        isSavedByMe,
       isMyPost: post.userId.equals(currentUserId)
    };
};
