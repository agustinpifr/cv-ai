const mongoose = require("mongoose");
const cvSchema = require("./schemas/cv.schema");
const Cv = mongoose.model("Cv", cvSchema);

module.exports = Cv;