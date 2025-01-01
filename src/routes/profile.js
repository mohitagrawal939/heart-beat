const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const sendResponse = require("../utils/responseSender");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        sendResponse(res, 200, user);
    } catch (err) {
        sendResponse(res, 400, null, "Error : " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req.body)) {
            throw new Error("Invalid edit request");
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });

        sendResponse(
            res,
            200,
            loggedInUser,
            `${loggedInUser.firstName} Profile updated successfully`
        );
    } catch (err) {
        sendResponse(res, 400, null, "Error : " + err.message);
    }
});

module.exports = profileRouter;
