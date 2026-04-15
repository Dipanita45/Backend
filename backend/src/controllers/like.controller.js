import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js"; // ✅ FIX
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// toggle like on video
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    const existingLike = await Like.findOne({
        video: videoId,                                 //isse pta krte hai like pehle se to nhi hai
        likedBy: req.user?._id
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);

        return res.status(200).json(
            new ApiResponse(200, {}, "Video unliked")
        );
    }

    const like = await Like.create({
        video: videoId,
        likedBy: req.user?._id
    });

    return res.status(200).json(
        new ApiResponse(200, like, "Video liked")
    );
});

// toggle like on comment
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId");
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        //kya is user ne already is comment ko like kiya hai?Agar database me record mil gaya → existingLike me data aa jayega
//Agar nahi mila → null
        return res.status(200).json(     
            new ApiResponse(200, {}, "Comment unliked successfully")
        );
    }

    const like = await Like.create({
        comment: commentId,
        likedBy: req.user?._id
    });

    return res.status(200).json(
        new ApiResponse(200, like, "Comment liked successfully")
    );
});

// toggle like on tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweetId");
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);

        return res.status(200).json(
            new ApiResponse(200, {}, "Tweet unliked successfully")
        );
    }

    const like = await Like.create({
        tweet: tweetId,
        likedBy: req.user?._id
    });

    return res.status(200).json(
        new ApiResponse(200, like, "Tweet liked successfully")
    );
});


// get liked videos
const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Like.find({
        likedBy: req.user?._id,
        video: { $exists: true, $ne: null }
    }).populate("video");

    return res.status(200).json(
        new ApiResponse(200, likedVideos, "Liked videos fetched")
    );
});

export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
};