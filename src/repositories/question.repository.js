const Question = require("../models/question.models");

const saveQuestion = async (question) => {
  const newQuestion = new Question(question);
  return await newQuestion.save();
};

const findQuestionById = async (id) => {
  return await Question.findById(id);
};

const findAllQuestions = async () => {
  return await Question.find();
};

const findQuestionsByUserId = async (userId) => {
  return await Question.find({ userId });
};

module.exports = {
  saveQuestion,
  findQuestionById,
  findAllQuestions,
  findQuestionsByUserId,
};
