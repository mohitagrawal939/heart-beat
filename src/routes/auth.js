const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const sendResponse = require("../utils/responseSender");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);

        const { firstName, lastName, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            password: hashedPassword,
            email,
        });
        const savedUser = await user.save({ isNew: true });
        const token = await savedUser.getJWT();
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
        });
        sendResponse(res, 201, savedUser, "User added successfully.");
    } catch (err) {
        sendResponse(res, 400, null, "Error : " + err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid credentials.");
        }
        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            const token = await user.getJWT();

            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });
            sendResponse(res, 200, user, "Login successful.");
        } else {
            throw new Error("Invalid credentials.");
        }
    } catch (err) {
        sendResponse(res, 400, null, "Error : " + err.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    // res.clearCookie("token"); -- this is also a way to clear cookie
    res.cookie("token", "", {
        expires: new Date(Date.now()),
    });
    sendResponse(res, 200, null, "Logout successful.");
});

module.exports = authRouter;
