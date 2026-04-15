import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
// //TODO: get all comments for a video
  const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

if(!isValidObjectId(videoId)){
    throw new ApiError(401,"videoIDis required");
}

//pagination
const skip = (page-1)*limit;

//DB query

const comments = await Comment.find({video: videoId})
.populate("owner", "username fullName avatar")  //populate ka use hota hai related data laane ke liye
.sort({createdAt:-1})  //desc order
.skip(skip)
.limit(Number(limit));


//total comments count
const Totalcomments = await Comment.countDocuments({video :videoId})

return res.status(200)
.json(new ApiResponse(200,
    {
        comments,
         Totalcomments,
        currentPage: Number(page),
          totalPages: Math.ceil(Totalcomments / limit)
            },
            "Comments fetched successfully"
        )
    );
});

const addComment= asyncHandler(async(req,res)=>{
      const { comments } = req.body;
    const { videoId } = req.params;

    //req.params = URL ke andar jo dynamic value aati hai
// { videoId } = usme se videoId nikaal rahe ho (destructuring)

if(!comments || comments.trim()=== ""){
    throw new ApiError(400,"comments is required");
}

if(!isValidObjectId(videoId)){
    throw new ApiError(400,"Invalid video id")
}

// ADD COMMENT 
const comment = await Comment.create({
    content: comments,
    video: videoId,
    owner: req.user?._id
});

return res.status(201).json(
    new ApiResponse(201, comment, "Comment added successfully")
);
});

const updateComment = asyncHandler(async (req, res) => {
    const { comments } = req.body;
    const { commentId } = req.params; 

    // validation
    if (!comments || comments.trim() === "") {
        throw new ApiError(400, "Comment is required"); 
    }

    if (!isValidObjectId(commentId)) { 
        throw new ApiError(400, "Invalid comment id");
    }

    // update
    const comment = await Comment.findByIdAndUpdate(
        commentId, 
        { $set: { content: comments } },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, comment, "Comment updated successfully")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
    // delete a comment

     const { comments } = req.body;
    const { commentId } = req.params; 

    // validation
    if (!comments || comments.trim() === "") {
        throw new ApiError(400, "Comment is required"); 
    }

    //delete
    const comment = await Comment.findByIdAndDelete(commentId)

    if(!comment){
        throw new ApiError(400,"Comment not found!")
    }
    
    return res.status(200).json(
        new ApiResponse(200, {}, "Comment deleted successfully")
    );
});



export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
};