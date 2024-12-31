const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const user = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA);
        res.json({
            message: "Connection requests fetched successfully",
            data: connectionRequests,
        });
    } catch (err) {
        res.status(400).send("Error : " + err);
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

        res.json({
            message: "Connections fetched successfully",
            data,
        });
    } catch (err) {
        res.status(400).send("Error : " + err);
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
        res.json({
            data: users,
        });
    } catch (err) {
        res.status(400).send("Error : " + err);
    }
});

module.exports = userRouter;
