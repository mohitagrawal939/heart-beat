const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnectionRequest");

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
            const connectRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status,
            });
            const data = await connectRequest.save();
            res.json({
                message: "Request sent",
                data,
            });
        } catch (err) {
            res.status(400).send("Error : " + err.message);
        }
    }
);

module.exports = requestRouter;
