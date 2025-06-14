export const getCommentEntity = (comment, userEntity,currentUser) => {
    return {
        _id: comment._id,
        isMyComment: comment.userId.toString() === currentUser._id.toString(),
        isLikedByMe: comment.commentLike.map(id => id.toString()).includes(currentUser._id.toString()),
        userId: userEntity,
        commentContent: comment.commentContent,
        commentLikes: comment.commentLike.length,
        commentReplies: comment.commentReplies.length,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        __v: comment.__v,
    }

}