const express = require("express");
require("dotenv").config();
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "Mohit",
        lastName: "Agrawal",
        email: "mohitagrawal939@hmail.com",
        password: "123456",
    });
    try {
        await user.save();
        res.send("User added successfully.");
    } catch (err) {
        res.status(400).send("Unable to add users.");
    }
});

connectDB()
    .then(() => {
        console.log("Database connection established...");
        app.listen(3000, () => {
            console.log("server is successfully listening on port 3000...");
        });
    })
    .catch((err) => {
        console.log("Database connot be connected...", err);
    });
