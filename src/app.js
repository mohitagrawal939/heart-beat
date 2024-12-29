const express = require("express");
require("dotenv").config();
const { connectDB } = require("./config/database");

const app = express();

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
