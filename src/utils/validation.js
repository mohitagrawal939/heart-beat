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

module.exports = {
    validateSignUpData,
};
