import { Message } from "../../models/Message.js";
import { Chat } from "../../models/Chat.js";
import { User } from "../../models/User.js";
import mongoose from "mongoose";

const connectedUsers = new Map();

export const socketConnectionHandler = (io) => {
    try {
        io.on("connection", (socket) => {
            console.log("User connected", socket.id);

            // 🔐 Authenticate user on connection → Mark user online
            socket.on("auth-user", async (userId) => {
                console.log("User online event userId", userId);
                await User.findByIdAndUpdate(userId, { isOnline: true }, { upsert: true }).lean();
                connectedUsers.set(socket.id, userId);
            });

            // 🔴 Handle disconnection → Mark user offline and update last seen
            socket.on("disconnect", async () => {
                const userId = connectedUsers.get(socket.id);
                await User.findByIdAndUpdate(userId, {
                    isOnline: false,
                    lastSeen: new Date()
                }, { upsert: true }).lean();

                connectedUsers.delete(socket.id);
                console.log("Got disconnect event userId", userId);
            });

            // 💬 Join chat room (roomId = chatId)
            socket.on("join-chat", (roomIds) => {
                console.log("chats jonined", roomIds);
                
                roomIds.forEach(async (roomId) => {
                   await socket.join(roomId);
                    console.log(`User ${connectedUsers.get(socket.id)} joined room ${roomId}`);
                });

            });

            // ✍️ Typing event → Notify others in the room
            socket.on("typing", async ({ roomId, userId }) => {

                socket.to(roomId).emit("typing", roomId);

                console.log(`User ${userId} typing... (roomId ${roomId})`);

            });

            // 🛑 Stop typing event → Notify others in the room
            socket.on("stop-typing", async ({ roomId, userId }) => {

                socket.to(roomId).emit("stop-typing", roomId);
                console.log(`User ${userId} stopped typing (roomId ${roomId})`);
            });

            // 📩 New message event → Save message, update chat, and emit to room
            socket.on("new-message", async (message) => {
                const isBlocked = await checkBlocked(message.chat);

                if (isBlocked) {
                    return;
                }
                console.log("new-message event", message.text, message.chat, message.sender, message.seenBy)
                const newMessage = await Message.create({
                    chat: new mongoose.Types.ObjectId(message.chat),
                    sender: new mongoose.Types.ObjectId(message.sender),
                    text: message.text,
                    media: message.media,
                    seenBy: [
                        new mongoose.Types.ObjectId(message.sender),
                    ]
                });

                await Chat.findByIdAndUpdate(newMessage.chat, {
                    lastMessage: newMessage._id
                }).lean();

                const roomId = message.chat;

                socket.to(roomId).emit("new-message", newMessage);

                console.log("new-message send triggered")
            });

            // ✅ All messages seen event → Update DB and notify others in room
            socket.on("messages-seen", async ({ roomId, userId }) => {

                console.log("message-seen event", roomId, userId)
                await Message.updateMany({
                    chat: roomId,
                    seenBy: { $ne: new mongoose.Types.ObjectId(userId) }
                }, {
                    $addToSet: { seenBy: new mongoose.Types.ObjectId(userId) }
                }).lean();

                socket.to(roomId).emit("messages-seen", roomId);
            });
        });
    } catch (e) {
        console.log(e)
    }

    async function checkBlocked(roomId) {
        try {
            const chat = await Chat.findById(roomId).populate({
                path: "participants",
                model: "users",
                select: "_id blockedUsers"
            });

            if (!chat) {
                return true;
            }

            const [user1, user2] = chat.participants;
            const user1Id = user1._id.toString();
            const user2Id = user2._id.toString();

            // ❌ Check if either has blocked the other
            const user1BlockedUser2 = user1.blockedUsers?.some(
                (id) => id.toString() === user2Id
            );

            const user2BlockedUser1 = user2.blockedUsers?.some(
                (id) => id.toString() === user1Id
            );

            if (user1BlockedUser2 || user2BlockedUser1) {
                console.log(`One of the users (${user1Id}, ${user2Id}) has blocked the other.`);
                return true;
            } else {
                return false;
            }

        } catch (e) {
            return false;
        }
    }

}
