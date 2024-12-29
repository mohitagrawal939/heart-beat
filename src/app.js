const express = require("express");
require("dotenv").config();
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());
app.post("/signup", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.send("User added successfully.");
    } catch (err) {
        res.status(400).send("Unable to add users.");
    }
});

app.get("/user", async (req, res) => {
    const userEmail = req.body?.email;
    try {
        const result = await User.findOne({ email: userEmail });
        if (!result) {
            res.status(404).send("No users found.");
        } else {
            res.send(result);
        }
    } catch (err) {
        res.status(400).send("Unable to fetch user.");
    }
});

app.delete("/user", async (req, res) => {
    const userId = req.body?.userId;
    try {
        await User.findByIdAndDelete(userId);
        res.send("User deleted successfully.");
    } catch (err) {
        res.status(400).send("Unable to delete user.");
    }
});

app.patch("/user", async (req, res) => {
    const userId = req.body?._id;
    const data = req.body;
    try {
        await User.findByIdAndUpdate({ _id: userId }, data);
        res.send("User updated successfully.");
    } catch (err) {
        res.status(400).send("Unable to update user.");
    }
});

app.get("/feed", async (req, res) => {
    try {
        const result = await User.find({});
        if (result?.length === 0) {
            res.status(404).send("No users found.");
        } else {
            res.send(result);
        }
    } catch (err) {
        res.status(400).send("Unable to fetch users.");
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
