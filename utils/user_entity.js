export const getUserEntity = (user, hasActiveStories, isAllStoriesViewed,isOnline,lastSeen) => {
    return {
        username: user.username,
        name: user.name,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified,
        hasActiveStories,
        isAllStoriesViewed,
        ...(isOnline !== null && isOnline !== undefined && { isOnline }),
        ...(lastSeen !== null && lastSeen !== undefined && { lastSeen }),

    };
};
