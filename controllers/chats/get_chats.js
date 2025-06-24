import { Message } from "../../models/Message.js";
import { User } from "../../models/User.js";
import { Chat } from "../../models/Chat.js";
import { serverError } from "../../utils/server_error_res.js";
import mongoose from "mongoose";
import { getMessageEntity } from "../../utils/message_entity.js";

export const getChats = async (req, res) => {
    try {
        const userId = req.userId;
        const { username } = req.params;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 30;
        const skip = (page - 1) * limit;

        const user = await User.findOne({ username: username }).lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }

        let messages = [];
        let chatId = "";

        const chat = await Chat.findOne({
            participants: {
                $all: [
                    user._id, new mongoose.Types.ObjectId(userId)
                ]
            }
        }).lean();

        if (chat) {
            const getMessages = await Message.find({
                chat: chat._id
            }).select("chat sender text media seenBy createdAt").sort({
                createdAt: -1
            }).
                skip(skip).limit(limit).lean();
            messages = getMessages.map((message) => {
                return getMessageEntity(message, userId, user)
            });

            chatId = chat._id;

        } else {
           const createdChat = await Chat.create({
                participants: [
                    user._id, new mongoose.Types.ObjectId(userId)
                ],
            });
            chatId = createdChat._id;
        }

        return res.status(200).json({
            success: true,
            chatId,
            messages
        })

    } catch (e) {
        serverError(res, e)
    }
}
