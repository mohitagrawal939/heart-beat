const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

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
            lowercase: true,
            required: true,
            unique: true,
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

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "7d",
    });
    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    );

    return isPasswordValid;
};
module.exports = mongoose.model("User", userSchema);
