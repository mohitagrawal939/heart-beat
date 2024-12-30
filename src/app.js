const express = require("express");
require("dotenv").config();
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
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
        await user.save({ isNew: true });
        res.send("User added successfully.");
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid credentials.");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            res.send("Login Successful.");
        } else {
            throw new Error("Invalid credentials.");
        }
    } catch (err) {
        res.status(400).send("Error : " + err.message);
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

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {
        const ALLOWED_UPDATES = [
            "photoUrl",
            "about",
            "gender",
            "age",
            "skills",
        ];

        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );

        if (!isUpdateAllowed) {
            throw new Error("Update not allowed.");
        }
        await User.findByIdAndUpdate({ _id: userId }, data, {
            runValidators: true,
            returnDocument: "before",
        });
        res.send("User updated successfully.");
    } catch (err) {
        res.status(400).send("Unable to update user.");
    }
});

app.patch("/userByEmail", async (req, res) => {
    const userEmail = req.body?.email;
    const data = req.body;
    try {
        await User.findOneAndUpdate({ email: userEmail }, data);
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
