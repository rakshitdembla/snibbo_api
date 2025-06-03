export const getUserEntity = (user, hasActiveStories, isAllStoriesViewed) => {
    return {
        username: user.username,
        name: user.name,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified,
        hasActiveStories,
        isAllStoriesViewed,
    };
};
