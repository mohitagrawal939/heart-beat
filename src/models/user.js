const mongoose = require("mongoose");

// both below type is valid way to define schema with it's types
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: String,
    age: Number,
    gender: String,
});

module.exports = mongoose.model("User", userSchema);
