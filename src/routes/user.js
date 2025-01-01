const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const sendResponse = require("../utils/responseSender");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA);
        sendResponse(
            res,
            200,
            connectionRequests,
            "Connection requests fetched successfully"
        );
    } catch (err) {
        sendResponse(res, 400, null, "Error : " + err);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" },
            ],
        })
            .populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((connectionRequest) => {
            if (
                connectionRequest.fromUserId._id.toString() ===
                loggedInUser._id.toString()
            ) {
                return connectionRequest.toUserId;
            }
            return connectionRequest.fromUserId;
        });

        sendResponse(res, 200, data, "Connections fetched successfully");
    } catch (err) {
        sendResponse(res, 400, null, "Error : " + err);
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page || 1);
        const limit = parseInt(req.query.limit || 10);
        const skip = (page - 1) * limit;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id },
            ],
        }).select("fromUserId toUserId");

        const hideUserIdsFromFeed = new Set();
        connectionRequest.forEach((request) => {
            hideUserIdsFromFeed.add(request.fromUserId.toString());
            hideUserIdsFromFeed.add(request.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserIdsFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ],
        })
            .select(USER_SAFE_DATA)
            .limit(limit)
            .skip(skip);

        sendResponse(res, 200, users, "Feed fetched successfully");
    } catch (err) {
        sendResponse(res, 400, null, "Error : " + err);
    }
});

module.exports = userRouter;
