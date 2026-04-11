import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.models.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async(req,res) =>{
   //data lena
    const content  = req.body
    //check data
   if (!content || content.trim() === "") {
        throw new ApiError(400, "Tweet content is required");
    }
    //creation 

    const tweet = await Tweet.create({
        content,
        owner  : req.user?._id //login user only
    })

    //validation
    if(!tweet){
        throw new ApiResponse(500, "Something went wrong while creating tweet");
    }
 
    //response
  return res.status(200)
  .json(new ApiResponse())
})