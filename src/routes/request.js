const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const sendResponse = require("../utils/sendResponse");
const requestRouter = express.Router();

requestRouter.post(
    "/request/send/:status/:toUserId",
    userAuth,
    async (req, res) => {
        try {
            const fromUserId = req.user._id;
            const toUserId = req.params.toUserId;
            const status = req.params.status;

            const allowedStatus = ["ignored", "interested"];
            if (!allowedStatus.includes(status)) {
                sendResponse(res, 400, null, "Invalid status");
            }

            const toUser = await User.findById(toUserId);
            if (!toUser) {
                return sendResponse(res, 400, null, "User not found");
            }
            const existingRequest = await ConnectionRequest.findOne({
                $or: [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId },
                ],
            });
            if (existingRequest) {
                return sendResponse(
                    res,
                    400,
                    null,
                    "Connection request already sent"
                );
            }

            const connectRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status,
            });
            const data = await connectRequest.save();
            sendResponse(
                res,
                200,
                data,
                `${req.user.firstName} sent connection request to ${toUser.firstName} and status is ${status}`
            );
        } catch (err) {
            sendResponse(res, 400, null, "Error : " + err.message);
        }
    }
);

requestRouter.post(
    "/request/review/:status/:requestId",
    userAuth,
    async (req, res) => {
        try {
            const loggedInUser = req.user;
            const { status, requestId } = req.params;
            const allowedStatus = ["accepted", "rejected"];
            if (!allowedStatus.includes(status)) {
                return sendResponse(res, 400, null, "Invalid status");
            }

            const connectionRequest = await ConnectionRequest.find({
                _id: requestId,
                toUserId: loggedInUser._id,
                status: "interested",
            });
            if (!connectionRequest) {
                return sendResponse(res, 400, null, "Request not found");
            }

            connectionRequest.status = status;

            const data = await connectionRequest.save();

            sendResponse(res, 200, data, `Connection request ${status}`);
        } catch (err) {
            sendResponse(res, 400, null, "Error : " + err.message);
        }
    }
);

module.exports = requestRouter;
