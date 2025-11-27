import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid VideoId");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const likedAlready = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  if (likedAlready) {
    await Like.findByIdAndDelete(likedAlready._id);

    return res
      .status(200)
      .json(
        new ApiResponse(200, { isLiked: false }, "Video unliked successfully")
      );
  }

  await Like.create({
    video: videoId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { isLiked: true }, "Video Liked successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid commentId");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const likedAlready = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  if (likedAlready) {
    await Like.findByIdAndDelete(likedAlready._id);

    return res
      .status(200)
      .json(
        new ApiResponse(200, { isLiked: false }, "comment unliked successfully")
      );
  }

  await Like.create({
    comment: commentId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { isLiked: true }, "Comment Liked successfully")
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweetId");
  }

  const likedAlready = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (likedAlready) {
    await Like.findByIdAndDelete(likedAlready._id);

    return res
      .status(200)
      .json(
        new ApiResponse(200, { isLiked: false }, "Tweet unliked successfully")
      );
  }

  await Like.create({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { isLiked: true }, "Tweet Liked successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos

  const userId = req.user._id;
  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        video: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoDetails",
      },
    },
    {
      $unwind: "$videoDetails",
    },
    {
      $lookup: {
        from: "likes",
        let: {
          videoId: "$videoDetails._id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$video", "$$videoId"],
              },
            },
          },
        ],
        as: "allLikes",
      },
    },
    {
      $addFields: {
        totalLikes: {
          $size: "$allLikes",
        },
        isLiked: true,
      },
    },
    {
      $project: {
        _id: 0,
        video: "$videoDetails",
        totalLikes: 1,
        isLiked: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
