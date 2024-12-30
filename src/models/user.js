const mongoose = require("mongoose");
const validator = require("validator");

// both below type is valid way to define schema with it's types
const userSchema = new mongoose.Schema(
    {
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
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid email address.");
                }
            },
        },
        password: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            min: 18,
        },
        gender: {
            type: String,
            validate(value) {
                if (!["male", "female", "others"].includes(value)) {
                    throw Error("Gender is not validate.");
                }
            },
        },
        photoUrl: {
            type: String,
            default: "https://dummyimage.com",
            validate(value) {
                if (!validator.isURL(value)) {
                    throw new Error("Invalid photo URL.");
                }
            },
        },
        skills: [String],
        about: {
            type: String,
            default: "This is default about description",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
