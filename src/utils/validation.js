const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, email, lastName, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("User name is required.");
    } else if (!validator.isEmail(email)) {
        throw new Error("Invalid email address.");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please create strong password.");
    }
};

const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "email",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills",
    ];

    const isEditAllowed = Object.keys(req.body).every((field) => {
        allowedEditFields.includes(field);
    });

    return isEditAllowed;
};

module.exports = {
    validateSignUpData,
    validateEditProfileData,
};
