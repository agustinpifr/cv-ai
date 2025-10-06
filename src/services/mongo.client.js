const mongoose = require("mongoose");

const connect = async () => {
  const {
    MONGODB_CONNECTION_STRING,
    MONGODB_DB_NAME,
    MONGODB_SERVER_SELECTION_TIMEOUT
  } = process.env;
  try {
    await mongoose.connect(MONGODB_CONNECTION_STRING, {
      dbName: MONGODB_DB_NAME,
      serverSelectionTimeoutMS: Number(MONGODB_SERVER_SELECTION_TIMEOUT),
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connect;
