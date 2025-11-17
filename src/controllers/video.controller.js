import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
  const pipeline = [];

  if (query) {
    pipeline.push({
      $search: {
        index: "search-videos",
        text: {
          query,
          path: ["title", "description"],
        },
      },
    });
  }

  //Filter by user
  if (userId) {
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid userId");
    }

    pipeline.push({
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    });
  }

  //only published videos
  pipeline.push({
    $match: {
      isPublished: true,
    },
  });

  if (sortBy && sortType) {
    pipeline.push({
      $sort: {
        [sortBy]: sortType === "asc" ? 1 : -1,
      },
    });
  } else {
    pipeline.push({
      $sort: {
        createdAt: -1, //newest first
      },
    });
  }

  pipeline.push(
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              userName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    { $unwind: "$ownerDetails" }
  );

  const videoAggregate = Video.aggregate(pipeline);

  const options = {
    page: Number(page),
    limit: Number(limit),
  };

  const video = await Video.aggregatePaginate(videoAggregate, options);

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  // TODO: get video, upload to cloudinary, create video
  const videoFileLocalPath = req.files?.videoFile[0].path;
  const thumbnailLocalPath = req.files?.thumbnail[0].path;

  if (!videoFileLocalPath) {
    throw new ApiError(400, "videoFileLocalPath is required");
  }
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "thumbnailLocalPath is required");
  }

  const videoUpload = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoUpload) {
    throw new ApiError(400, "Video is required");
  }

  if (!thumbnailUpload) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const video = await Video.create({
    title,
    description,
    duration: video.duration || 0,
    videoFile: videoUpload.url,
    thumbnail: thumbnailUpload.url,
    owner: req.user._id,
  });

  const videoUploaded = await Video.findById(video._id);
  if (!videoUploaded) {
    throw new ApiError(500, "Somthing went wrong while video uploading");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, video, "Video Uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
