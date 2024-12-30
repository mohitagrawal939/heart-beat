const mongoose = require("mongoose");

// both below type is valid way to define schema with it's types
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: Number,
    gender: String,
});

module.exports = mongoose.model("User", userSchema);
