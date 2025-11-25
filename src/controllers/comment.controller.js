import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const comments = await Comment.find({ video: videoId })
    .populate("owner", "fullName userName avatar")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const totalComments = await Comment.countDocuments({ video: videoId });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        comments,
        totalComments,
        currentPage: Number(page),
        totalPages: Math.ceil(totalComments / limit),
      },
      "Video Comments fetched Successfully"
    )
  );
});

const getTweetComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { tweetId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweetId");
  }

  const comments = await Comment.find({ tweet: tweetId })
    .populate("owner", "fullName userName avatar")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const totalComments = await Comment.countDocuments({ tweet: tweetId });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        comments,
        totalComments,
        currentPage: Number(page),
        totalPages: Math.ceil(totalComments / limit),
      },
      "Tweet Comments fetched Successfully"
    )
  );
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video or comment

  const { videoId, tweetId } = req.params;
  const { content } = req.body;
  if (!content || !content.trim()) {
    throw new ApiError(400, "Content cannot be empty");
  }

  let data = { content, owner: req.user._id };
  if (videoId) {
    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid videoId");
    }

    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Video Not Found");
    }

    data.video = videoId;
  } else if (tweetId) {
    if (!isValidObjectId(tweetId)) {
      throw new ApiError(400, "Invalid tweetId");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      throw new ApiError(404, "Tweet Not Found");
    }

    data.tweet = tweetId;
  } else {
    throw new ApiError(400, "videoId or tweetId is required");
  }

  const comment = await Comment.create(data);

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content.trim()) {
    throw new ApiError(400, "Content is required");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment Not Found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "Only comment owner can edit their Comment");
  }

  comment.content = content.trim();
  const updatedComment = await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated Successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment

  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid commentId");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "Only comment owner can delete their Comment");
  }

  await Comment.findByIdAndDelete(commentId);

  await Like.deleteMany({
    comment: commentId,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment delted successfully"));
});

export {
  getVideoComments,
  getTweetComments,
  addComment,
  updateComment,
  deleteComment,
};
