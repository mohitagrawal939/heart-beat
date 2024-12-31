const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.objectId,
            ref: "User",
            required: [true, "fromUserId is required"],
        },
        toUserId: {
            type: mongoose.Schema.Types.objectId,
            ref: "User",
            required: [true, "toUserId is required"],
        },
        status: {
            type: String,
            required: [true, "status is required"],
            enum: {
                values: ["ignore", "interested", "accepeted", "rejected"],
                message: "(VALUE} is incorrect status type.",
            },
        },
    },
    {
        timestamps: true,
    }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
    const connectRequest = this;

    // as we are comparing objectIds, we need to convert them to string to compare.
    // if we dont want to convert them to string, we can use .equals method of mongoose
    if (connectRequest.toUserId.equals(connectRequest.fromUserId)) {
        throw new Error("You can't send request to yourself");
    }
    next();
});

const ConnectionRequest = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
);

module.exports = ConnectionRequest;
