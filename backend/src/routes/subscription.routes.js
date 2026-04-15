import { Router } from "express";
import {
    togglesubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}from "../controllers/subscription.controller"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT);

router
.route("/c/:channelId")
 .get(getSubscribedChannels)
.post(togglesubscription);
router.route("/u/:subscriberId").get(getUserChannelSubscribers);

export default router