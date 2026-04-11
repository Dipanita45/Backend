import mongoose,{isValidObjectId} from "mongoose"
import {Video} from "../models/video.model"
import {User } from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    
//Step by step:

//filter लगाओ (search)
//sort करो
//skip करो
//limit लगाओ
 //Output: filtered videos


    //filter object
    const filter = {};

    if(query){
        filter.title ={
            $regex: query,
            $options : "i"
        };
    }

    //Sorting
    const sortOptions  = {}
sortOptions[sortBy] = sortType === "asc"?1:-1;

//pagination

const pageNum = Number(page)
const limitNum = Number(limit)

const skip = (pageNum - 1) * limitNum;

//Db Query

 const videos = await Video.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit));

        const totalVideos = await Video.countDocuments(filter);

       //response
       
return res.status(200)
.json(new ApiResponse(200,
     {
                videos,
                totalVideos,
                currentPage: Number(page),
                totalPages: Math.ceil(totalVideos / limit)
            },
            "video fetch successfully"
)
);
});