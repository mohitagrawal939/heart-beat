const mongoose = require("mongoose");

// both below type is valid way to define schema with it's types
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: String,
    photoUrl: {
        type: String,
        default: "https://dummyimage.com",
    },
    skills: [String],
    about: {
        type: String,
        default: "This is default about description",
    },
});

module.exports = mongoose.model("User", userSchema);
