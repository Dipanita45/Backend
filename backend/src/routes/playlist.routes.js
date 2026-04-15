import { Router } from "express";
import {
    createPlaylist,
    getUserPlaylist,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoPlaylist,
    deleteUserPlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); //all routes protected

// CREATE PLAYLIST
router.route("/").post(createPlaylist);

// GET / UPDATE / DELETE PLAYLIST
router
    .route("/:playlistId")
    .get(getPlaylistById)
    .patch(updatePlaylist)
    .delete(deleteUserPlaylist);                //Playlist already exist karti hai
                                                //Hum bas usme video add/remove kar rahe hain -> Isliye PATCH use krte hain
// ADD VIDEO
router.route("/add/:videoId/:playlistId")
    .patch(addVideoToPlaylist);


//REMOVE VIDEO
router.route("/remove/:videoId/:playlistId")
    .patch(removeVideoPlaylist); // 🔥 FIX


//GET USER PLAYLISTS
router.route("/user/:userId")
    .get(getUserPlaylist);

export default router;