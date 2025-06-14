export const getreplyEntity = (reply, userEntity,currentUser) => {
    return {
        _id: reply._id,
        isMyreply: reply.userId.toString() === currentUser._id.toString(),
        isLikedByMe: reply.replyLikes.map(id => id.toString()).includes(currentUser._id.toString()),
        userId: userEntity,
        replyContent: reply.replyContent,
        replyLikes: reply.replyLikes.length,
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt,
        __v: reply.__v,
    }

}