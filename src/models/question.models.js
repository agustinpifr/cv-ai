const mongoose = require("mongoose");
const questionSchema = require("./schemas/question.schema");
const Question = mongoose.model("Question", questionSchema);

module.exports = Question;