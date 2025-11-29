# 🚀StreamX – Full-Featured JavaScript Backend API

## Full-featured JavaScript Backend API inspired by YouTube + X (Twitter)

This project is a production-ready Node.js + Express backend powered by MongoDB, featuring JWT authentication, Cloudinary media uploads, playlist management, video and tweet modules, likes, comments, subscriptions, and full dashboard analytics — all structured using scalable MVC architecture and optimized MongoDB aggregation pipelines.

## 📌Features

### 🔐 Authentication & Authorization

- Register/login/logout

- Refresh tokens

- Password hashing & token refresh

- JWT-based secure authentication

- Protected routes with verifyJWT middleware

### 👤 User System

- Update username, email, password

- Update avatar and cover image (Cloudinary upload + old image deletion)

- Get User channel profile

- User dashboard analytics

- Subscriptions (channel → subscriber system)

### 🎥 Video Module

- Upload videos & thumbnails via Cloudinary

- Publish / Unpublish videos

- Update & delete videos

- Like / Unlike videos

- Comment system

- Video views

- Get channel videos

- Dashboard analytics for views, likes, comments

- Pagination & aggregation queries

### 📝 Tweet Module

- Create, update, delete tweets

- Like / Unlike tweets

- Comment on tweets

- Fetch tweet comments using aggregation

- Fetch user tweets with like count & isLiked flag

### 💬 Comments Module

- Add comments to videos or tweets

- Update & delete comments

- Like comments

- Aggregation-based comment fetching with:

  - Owner details

  - likesCount

  - isLiked

### ❤️ Likes System

- Like videos, tweets, or comments

- ToggleLike controllers

- Get all liked videos by a user

### 📺 Playlists Module

- Create playlist

- Add/remove videos in playlists

- Delete playlist

- Get all playlists

- Aggregated playlist details with video info

### 🔔 Subscriptions

- Subscribe/Unsubscribe to a channel

- Get all subscribers of a user’s channel

- Get all channels a user subscribed to

### 🧾 Dashboard

- Channel analytics (total subscribers, videos, tweets, views, likes, comments)

- Video analytics (likes, comments, createdAt parts)

### 🔍 Health Check

- API health status endpoint

## Link

[Model link](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)

## ☁️ Cloudinary Integration

- Upload avatar, cover image, thumbnails, and videos

- Delete old images using:

  - deleteOnCloudinary()

- Auto-detect resource type (image/video)

## 🛠️ Error Handling & Utilities

- Custom ApiError and ApiResponse classes

- Async wrapper asyncHandler

- Mongoose validation handling

- Clean folder structure

- Environment variable setup

## 🛠️Tech Stack

| Layer            | Technology                       |
| ---------------- | -------------------------------- |
| Runtime          | Node.js                          |
| Framework        | Express.js                       |
| Database         | MongoDB + Mongoose               |
| Authentication   | JWT                              |
| Media storage    | Cloudinary                       |
| File upload      | Multer                           |
| Password hashing | Bcrypt                           |
| Utilities        | Custom Error & Response handlers |
| Tools            | Nodemon, Prettier                |

## 📁 Folder Structure

```bash
src/
│── controllers/
│   ├── comment.controller.js
│   ├── dashboard.controller.js
│   ├── healthcheck.controller.js
│   ├── like.controller.js
│   ├── playlist.controller.js
│   ├── subscription.controller.js
│   ├── tweet.controller.js
│   └── user.controller.js
│   └── video.controller.js
│
│── db/
│   └── index.js
│
│── middlewares/
│   ├── auth.middleware.js
│   └── multer.middleware.js
│
│── models/
│   ├── comment.model.js
│   ├── like.model.js
│   ├── playlist.model.js
│   ├── subscription.model.js
│   ├── tweet.model.js
│   ├── user.model.js
│   └── video.model.js
│
│── routes/
│   ├── comment.routes.js
│   ├── dashboard.routes.js
│   ├── healthcheck.routes.js
│   ├── like.routes.js
│   ├── playlist.routes.js
│   ├── subscription.routes.js
│   ├── tweet.routes.js
│   ├── user.routes.js
│   └── video.routes.js
│
│── utils/
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   ├── cloudinary.js
│   ├── constants.js
│   └── index.js
│
├── app.js
├── package.json
└── .env


```

## 📦Installation

**Clone the repository**

```bash
 git clone https://github.com/NausheenFaiyaz/Javascript_backend_Project.git
 cd Javascript_backend_Project
```

**Install dependencies**

```bash
 npm install
```

**🔧Create .env file**

```bash
PORT= 8000
CORS_ORIGIN=*
MONGODB_URI= xxxx
ACCESS_TOKEN_SECRET= xxxx
ACCESS_TOKEN_EXPIRY= 1d
REFRESH_TOKEN_SECRET= xxxx
REFRESH_TOKEN_EXPIRY= 10d
CLOUDINARY_CLOUD_NAME= xxxx
CLOUDINARY_API_KEY= xxxx
CLOUDINARY_API_SECRET= xxxx
```

## Running Tests

To run server, run the following command

```bash
  npm run dev
```

## 🧪 Testing (Postman Recommended)

Import all routes using provided endpoints and test protected routes with JWT token.
