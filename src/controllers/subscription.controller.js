import mongoose,{isValidObjectId} from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { subscribe } from "diagnostics_channel";

const togglesubscription  = asyncHandler(async(req,res)=>{
    const { channel } = req.params
    //toggle

    if(!isValidObjectId){
        throw new ApiError(401,"Invalid channel id");
    }
    if (channel === req.user?._id.toString()){
        throw new ApiError(400,"You cannot subscribe itself");
    }

    const existingSubscription = await Subscription.findOne({
    channel: channel,
    subscriber: req.user?._id
});
   if (existingSubscription) {
        await Subscription.findByIdAndDelete(existingSubscription._id);

        return res.status(200).json(
            new ApiResponse(200, {}, "Unsubscribed successfully")
        );
    }

    const newSubscription = await Subscription.create({
         channel: channel,
        subscriber: req.user?._id
    })
})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    togglesubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}