export const getFullUserEntity = (
    user,
    hasActiveStories,
    isAllStoriesViewed,
    isMyself,
    isFollowedByMe
) => {
    return {
        username: user.username,
        name: user.name,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified,
        hasActiveStories,
        isAllStoriesViewed,
        isMyself,          
        isFollowedByMe      
    };
};
