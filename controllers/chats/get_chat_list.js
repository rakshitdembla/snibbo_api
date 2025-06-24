import mongoose from "mongoose";
import { Chat } from "../../models/Chat.js";
import { Story } from "../../models/Story.js";
import { serverError } from "../../utils/server_error_res.js";
import { getMessageEntity } from "../../utils/message_entity.js";
import { getUserEntity } from "../../utils/user_entity.js";
import { User } from "../../models/User.js";

export const getChatList = async (req, res) => {
    try {
        const userId = req.userId;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get all chats where current user is a participant
        const getChats = await Chat.aggregate([
            {
                $match: {
                    participants: new mongoose.Types.ObjectId(userId)
                }
            },
            // Remove current user from participants array to get the other user
            {
                $set: {
                    participants: {
                        $filter: {
                            input: "$participants",
                            as: "participant",
                            cond: {
                                $ne: ["$$participant", new mongoose.Types.ObjectId(userId)]
                            }
                        }
                    }
                }
            },
            // Flatten remaining participant
            { $unwind: "$participants" },
            // Get full user data for the other participant
            {
                $lookup: {
                    from: "users",
                    localField: "participants",
                    foreignField: "_id",
                    as: "participantInfo"
                }
            },
            { $unwind: "$participantInfo" },
            // Get last message info for the chat
            {
                $lookup: {
                    from: "messages",
                    localField: "lastMessage",
                    foreignField: "_id",
                    as: "lastMessage"
                }
            },
            {
                $unwind: {
                    path: "$lastMessage",
                    preserveNullAndEmptyArrays: true
                }
            },
            // Return only necessary fields
            {
                $project: {
                    _id: 1,
                    lastMessage: 1,
                    participantInfo: 1
                }
            },
            // Sort chats by latest message
            {
                $sort: {
                    "lastMessage.createdAt": -1
                }
            },
            { $skip: skip },
            { $limit: limit }
        ]);

        if (getChats.length == 0) {
            return res.status(200).json({
                success: true,
                getChats
            });
        }

        // Get current user 
        const currentUser = await User.findById(userId);
        const myBlockedUsers = currentUser.blockedUsers.map(id => id.toString());

        // Loop through each chat and prepare full response
        const chats = await Promise.all(getChats.map(async (chat) => {
            
            const participant = chat.participantInfo;
            const participantId = participant._id.toString();
            

            // Check if the participant has any active stories
            const stories = await Story.find({ userId: participantId });
            const hasActiveStories = stories.length > 0;

            

            // Determine if all participant stories are viewed by current user
            let isAllStoriesViewed = hasActiveStories;
            for (const story of stories) {
                if (!story.storyViews.includes(userId)) {
                    isAllStoriesViewed = false;
                    break;
                }
            }
            

            // Check if the current user has blocked the participant
            const isBlockedByMe = myBlockedUsers.includes(participantId);
            

            // Check if either user has blocked the other
            let isBlocked = false;
            if (isBlockedByMe) {
                isBlocked = true;
            } else {
                const participantBlockedUsers = participant.blockedUsers.map(id => id.toString());
                isBlocked = participantBlockedUsers.includes(userId.toString());
            }

            // Format chat response
            return {
                _id: chat._id,
                lastMessage: chat.lastMessage != null && chat.lastMessage != undefined && chat.lastMessage != {} ? getMessageEntity(chat.lastMessage, userId, participant) : null,
                participantInfo: getUserEntity(
                    participant,
                    hasActiveStories,
                    isAllStoriesViewed,
                    participant.isOnline,
                    participant.lastSeen
                ),
                isBlocked,
                isBlockedByMe
            };
        }));

        return res.status(200).json({
            success: true,
            chats
        });

    } catch (e) {
        serverError(res, e);
    }
};
