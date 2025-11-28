import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

  const userId = req.user._id;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid userId");
  }

  const videoStats = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "videoLikes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "videoComments",
      },
    },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
        totalLikes: { $sum: { $size: "$videoLikes" } },
        totalComments: { $sum: { $size: "$videoComments" } },
      },
    },
  ]);
  const tweetStats = await Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "tweetLikes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "tweet",
        as: "tweetComments",
      },
    },
    {
      $group: {
        _id: null,
        totalTweets: { $sum: 1 },
        totalLikes: { $sum: { $size: "$tweetLikes" } },
        totalComments: { $sum: { $size: "$tweetComments" } },
      },
    },
  ]);

  const subscribers = await Subscription.countDocuments({
    channel: userId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVideos: videoStats[0]?.totalVideos || 0,
        totalVideoViews: videoStats[0]?.totalViews || 0,
        totalVideoLikes: videoStats[0]?.totalLikes || 0,
        totalVideoComments: videoStats[0]?.totalComments || 0,
        totalTweets: tweetStats[0]?.totalTweets || 0,
        totalTweetLikes: tweetStats[0]?.totalLikes || 0,
        totalTweetComments: tweetStats[0]?.totalComments || 0,
        totalSubscribers: subscribers,
      },
      "Channel Stats fetched successfully"
    )
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel

  const userId = req.user._id;

  if (!isValidObjectId) {
    throw new ApiError(400, "Invalid userId");
  }

  const videos = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "videoLikes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "videoComments",
      },
    },
    {
      $addFields: {
        likesCount: {
          $size: "$videoLikes",
        },
        commentsCount: {
          $size: "$videoComments",
        },
        createdAtFormatted: {
          $dateToParts: {
            date: "$createdAt",
          },
        },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        views: 1,
        videoFile: 1,
        thumbnail: 1,
        likesCount: 1,
        commentsCount: 1,
        createdAt: {
          year: "$createdAtFormatted.year",
          month: "$createdAtFormatted.month",
          day: "$createdAtFormatted.day",
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
