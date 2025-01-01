const jwt = require("jsonwebtoken");
const User = require("../models/user");
const sendResponse = require("../utils/responseSender");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Invalid token. Please login again.");
        }
        const decodedObj = await jwt.verify(token, process.env.SECRET_KEY);
        const _id = decodedObj;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found.");
        }
        req.user = user;
        next();
    } catch (err) {
        sendResponse(res, 400, null, "Error : " + err.message);
    }
};

module.exports = {
    userAuth,
};
