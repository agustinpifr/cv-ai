const mongoose = require("mongoose");

const connect = async () => {
  const {
    MONGODB_CONNECTION_STRING,
    MONGODB_SERVER_SELECTION_TIMEOUT
  } = process.env;

  await mongoose.connect(MONGODB_CONNECTION_STRING, {
    serverSelectionTimeoutMS: Number(MONGODB_SERVER_SELECTION_TIMEOUT) || 10000,
    bufferCommands: false, // Disable buffering to fail fast if not connected
  });
  console.log("Connected to MongoDB");
};

module.exports = connect;
