export const getMessageEntity = (message, userId, user) => {
    return {
        _id: message._id,
        chat : message.chat,
        isSentByMe: message.sender._id.toString() === userId.toString(),
        text: message.text,
        media: message.media,
        isSeenByOther: message.seenBy.map((seenUser) => seenUser.toString()).includes(user._id.toString()),
        createdAt: message.createdAt
    }

}