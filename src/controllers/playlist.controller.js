import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createPLaylist = asyncHandler(async(req,res)=>{
  
    const {name, description} = req.body

if(!name|| name.trim() === ""){
    throw new ApiError(400, "name is required");
}

const playlist = await Playlist.create({
    name,
    description,
    owner : req.user?._id
});

return res.status(200)
.json(new ApiResponse(200,playlist,"playlist created successfully"));

})

//get user playlist

const getUserPlaylist = asyncHandler(async(req,res)=>{

const {userId} = req.params;
if(!userId){
    throw new ApiError(401,"userId is required")
}

const playlist = await Playlist.find({owner : userId})
.sort({createdAt: -1});

return res.status(200)
.json(new ApiResponse(200, playlist, "get user playlist successfully"));
})

//get playlistId
const getPlaylistUserId = asyncHandler(async (req, res) => {

    const { playlistId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "playlistId is required");
    }

    const playlist = await Playlist.findById(playlistId)
    .populate( "owner"," username email")
    .populate(videos)

     if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist fetched successfully")
    );
});
 // add video playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!playlistId || !videoId) {
        throw new ApiError(400, "playlistId and videoId are required");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    // duplicate check 
    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already exists in playlist");
    }

    playlist.videos.push(videoId);
    await playlist.save();

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video added to playlist")
    );
});


//remove video from playlist

const removeVideoPlaylist = asyncHandler(async(req,res)=>{
    const {playlistId,videoId} = req.params;
    if(!playlistId|| videoId){
        throw new ApiError(400, "playlistId and videoId are required");
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
         throw new ApiError(400, "Video already exists in playlist");
    }

    //remove logic
 playlist.videos = playlist.videos.filter(
        (vid) => vid.toString() !== videoId
    );

    await playlist.save();

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video removed from playlist")
    );
});

//delete playlist
 
const deleteUserPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "playlistId is required");
    }

    const deletedPlaylist = await Playlist.findOneAndDelete({
        _id: playlistId,
        owner: req.user?._id
    });

    if (!deletedPlaylist) {
        throw new ApiError(404, "Playlist not found or unauthorized");
    }

    return res.status(200).json(
        new ApiResponse(200, deletedPlaylist, "Playlist deleted successfully")
    );
});

const updatePlaylist = asyncHandler(async(req,res)=>{
     const {playlistId} = req.params
    const {name, description} = req.body

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id");
    }

    if(!name || description.trim()===""){
        throw new ApiError(400,"name and description is required")
    }

const playlist = await Playlist.findOneAndUpdate(
    {
        _id: playlistId,
        owner: req.user?._id
    },
    {
        $set: {
            name,
            description
        }
    },
    { new: true } // updated data return karega
);
    })
    

export {
    createPlaylist,
    getUserPlaylist,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoPlaylist,
    deleteUserPlaylist
};