const express = require("express");
require("dotenv").config();
require("./config/database");

const app = express();

app.listen(3000, () => {
    console.log("server is successfully listening on port 3000...");
});
