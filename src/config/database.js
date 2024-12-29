const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(process.env.DB_CONNECTION);
};

connectDB()
    .then(() => {
        console.log("Database connection established...");
    })
    .catch((err) => {
        console.log("Database connot be connected...", err);
    });
