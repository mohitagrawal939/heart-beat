const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.objectId,
            required: [true, "fromUserId is required"],
        },
        toUserId: {
            type: mongoose.Schema.Types.objectId,
            required: [true, "toUserId is required"],
        },
        status: {
            type: String,
            required: [true, "status is required"],
            enum: {
                values: ["ignore", "interested", "accepeted", "rejected"],
                message: "(VALUE} is incorrect status type",
            },
        },
    },
    {
        timestamps: true,
    }
);

const ConnectionRequest = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
);

module.exports = ConnectionRequest;
