# 🔥 Snibbo API

The **Snibbo API** is a powerful backend built with **Node.js + MongoDB**, structured to power a full-featured social media app built in Flutter. It provides full support for user authentication, posting, liking, commenting, live chatting, and story features — all optimized with paginated responses and real-time functionality using WebSockets.

---

## 🧠 Features

* 👤 User Authentication (Register, Login, Forgot/Reset Password)
* 📝 Full Post CRUD (Create, Update, Delete, Like/Dislike, Explore, Following Posts)
* 💾 Save & Unsave Posts
* 📖 Story System (Create, View, Delete, View Tracking)
* 💬 Comment System with Nested Replies, Like/Dislike
* 🔍 User Search, Profile View, Follow/Unfollow
* ⚡ **Live 1-on-1 Real-time Chat** with WebSocket support
* 🔒 Authenticated Routes using a simple `user_id` header
* 🔃 Pagination enabled across all list-fetching endpoints

---

## 🗂 Folder Structure

```bash
snibbo-api/
├── controllers/
│   ├── auth/
│   ├── chats/
│   ├── posts/
│   │   ├── comments/
│   │   ├── like/
│   │   └── saved/
│   ├── sockets/
│   ├── story/
│   └── user/
├── middlewares/
├── models/
├── routes/
├── utils/
├── .env
├── server.js
```

---

## ⚙️ Tech Stack

* **Node.js + Express** for the backend
* **MongoDB** with **Mongoose**
* **Flutter** as the frontend client
* **Nodemailer** for Email services
* **WebSockets** for live chat

---

## 🚀 Getting Started

1. Clone the repo

```bash
git clone https://github.com/rakshitdembla/snibbo_api.git
cd snibbo-api
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root and configure the following:

```env
MONGOOSE_CONNECTION = your_mongodb_connection_string
JWT_SECRET_KEY = your_jwt_secret
USER_EMAIL = your_email_for_password_resets
USER_PASSWORD = your_email_password
CLIENT_URL = http://localhost:3000/api/auth
PORT = 3000
CLIENT_ORIGIN = http://192.168.x.x:3000
```

4. Start the server

```bash
npm start
```

---

## 🔐 Authentication Middleware

All protected routes use a `user_id` header for identifying the authenticated user. Ensure you send it in requests where required.

```http
Headers:
  user_id: <user's MongoDB _id>
```

---

## 📬 API Route Overview

### 🔐 Auth Routes

* `POST /api/auth/register`
* `POST /api/auth/login`
* `POST /api/auth/forget-password`
* `POST /api/auth/reset-password/:token`

### 💬 Chat Routes (Real-time Chat)

* `GET /api/chat/blocked-users`
* `GET /api/chat/chats-list`
* `GET /api/chat/chats/:username`
* `POST /api/chat/block/:username`
* `POST /api/chat/unblock/:username`

### 📝 Post Routes

* `POST /api/posts/create`
* `PATCH /api/posts/update/:postId`
* `DELETE /api/posts/delete/:postId`
* `GET /api/posts/following-posts`
* `GET /api/posts/all`
* `GET /api/posts/explore`
* `GET /api/posts/user-posts/:username`
* `GET /api/posts/get-post/:postId`

### 👍 Post Likes

* `POST /api/posts/like/:postId`
* `POST /api/posts/dislike/:postId`
* `GET /api/posts/liked-users/:postId`
* `GET /api/posts/search-post-liked-user/:postId/:username`

### 💬 Comments

* `POST /api/posts/add-comment/:postId`
* `DELETE /api/posts/remove-comment/:commentId`
* `GET /api/posts/all-comments/:postId`
* `POST /api/posts/like-comment/:commentId`
* `POST /api/posts/dislike-comment/:commentId`
* `GET /api/posts/comment-likes/:commentId`

### 💬 Replies

* `POST /api/posts/add-reply/:commentId`
* `DELETE /api/posts/remove-reply/:replyId`
* `GET /api/posts/all-replies/:commentId`
* `POST /api/posts/like-reply/:replyId`
* `POST /api/posts/dislike-reply/:replyId`

### 💾 Saved Posts

* `POST /api/posts/save/:postId`
* `GET /api/posts/saved-posts/:username`
* `POST /api/posts/remove-saved/:postId`

### 📖 Story Routes

* `POST /api/story/create`
* `POST /api/story/view/:storyId`
* `DELETE /api/story/delete/:storyId`
* `GET /api/story/view-users/:storyId`
* `GET /api/story/followings/stories`
* `GET /api/story/my-stories`
* `GET /api/story/user-stories/:username`

### 👥 User Routes

* `GET /api/user/followers/:username`
* `GET /api/user/followings/:username`
* `POST /api/user/follow/:username`
* `POST /api/user/unfollow/:username`
* `POST /api/user/remove/:username`
* `PATCH /api/user/update-profile`
* `GET /api/user/profile/:username`
* `GET /api/user/search-follower/:username`
* `GET /api/user/search-following/:username`
* `GET /api/user/search-user/:username`

---

## ⚡ WebSocket Chat

Snibbo supports **1-to-1 real-time chat** using WebSockets:

* Messages are pushed instantly to connected users
* Socket controllers are located in `controllers/sockets/`
* Works smoothly with Flutter via `socket_io_client`

---

## 💻 Frontend Integration

* Built for the **Snibbo Flutter App**
* API strictly follows RESTful design
* Real-time features powered via WebSockets

---

## 📄 License

MIT License — Free to use and extend.
