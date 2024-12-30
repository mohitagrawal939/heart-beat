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

connectionRequestSchema.pre("save", function (next) {
    const connectRequest = this;

    if (connectRequest.toUserId === connectRequest.fromUserId) {
        throw new Error("You can't send request to yourself");
    }
    next();
});

const ConnectionRequest = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
);

module.exports = ConnectionRequest;
