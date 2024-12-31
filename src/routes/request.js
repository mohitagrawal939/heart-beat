const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
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
                return res.status(400).json({ message: "Invalid status" });
            }

            const toUser = await User.findById(toUserId);
            if (!toUser) {
                return res.status(400).json({ message: "User not found" });
            }
            const existingRequest = await ConnectionRequest.findOne({
                $or: [
                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId },
                ],
            });
            if (existingRequest) {
                return res
                    .status(400)
                    .json({ message: "Connection request already sent" });
            }

            const connectRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status,
            });
            const data = await connectRequest.save();
            res.json({
                message: `${req.user.firstName} sent connection request to ${toUser.firstName} ans status is ${status}`,
                data,
            });
        } catch (err) {
            res.status(400).send("Error : " + err.message);
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
                return res.status(400).json({ message: "Invalid status" });
            }

            const connectionRequest = await ConnectionRequest.find({
                _id: requestId,
                toUserId: loggedInUser._id,
                status: "interested",
            });
            if (!connectionRequest) {
                return res.status(400).json({ message: "Request not found" });
            }

            connectionRequest.status = status;

            const data = await connectionRequest.save();

            res.json({ data, message: `Connection request ${status}` });
        } catch (err) {
            res.status(400).send("Error : " + err.message);
        }
    }
);

module.exports = requestRouter;
