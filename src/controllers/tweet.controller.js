import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.models.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Create Tweet
const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Tweet content is required");
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user?._id
    });

    return res.status(201).json(
        new ApiResponse(201, tweet, "Tweet created successfully")
    );
});

// get User Tweets
const getUserTweets = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const tweets = await Tweet.find({ owner: userId })
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, tweets, "Tweets fetched successfully")
    );
});

// Update Tweet
const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id");
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required");
    }

    const tweet = await Tweet.findOneAndUpdate(
        { _id: tweetId, owner: req.user?._id },
        { content },
        { new: true }
    );

    if (!tweet) {
        throw new ApiError(404, "Tweet not found or unauthorized");
    }

    return res.status(200).json(
        new ApiResponse(200, tweet, "Tweet updated successfully")
    );
});

// Delete Tweet
const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id");
    }

    const tweet = await Tweet.findOneAndDelete({
        _id: tweetId,
        owner: req.user?._id
    });

    if (!tweet) {
        throw new ApiError(404, "Tweet not found or unauthorized");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Tweet deleted successfully")
    );
});

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
};