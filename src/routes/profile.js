const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validations");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("Error : " + err.message);
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

        res.json({
            message: `${loggedInUser.firstName} Profile updated successfully`,
            user: loggedInUser,
        });
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

module.exports = profileRouter;
