const mongoose = require("mongoose");
require("dotenv").config();

const client = mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    console.log("Error: ", error);
    return error;
  });

module.exports = client;
