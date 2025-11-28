const express = require("express");
const { postQuestion, postAnswer, getQuestions , getAnswers, getPDF, getTemplates, transcribe, getCVs, uploadImage, getImage, deleteImage } = require("../controllers/private.controller");
const { payloadMiddleware } = require("../middlewares/payload.middleware");
const { postAnswerSchema } = require("./validations/answer.schema");
const { postQuestionSchema } = require("./validations/question.schema");
const { pdfRequestSchema } = require("./validations/pdfRequest.schema");
const { transcribeSchema } = require("./validations/transcribe.schema");
const { imageSchema } = require("./validations/image.schema");
const authMiddleware = require("../middlewares/auth.middleware");
const privateRouter = express.Router();

privateRouter.post("/question", authMiddleware, payloadMiddleware(postQuestionSchema), postQuestion);

privateRouter.post("/answer", authMiddleware, payloadMiddleware(postAnswerSchema), postAnswer);

privateRouter.get("/questions", authMiddleware, getQuestions);

privateRouter.get("/answers", authMiddleware, getAnswers);

privateRouter.post("/pdf", authMiddleware, payloadMiddleware(pdfRequestSchema), getPDF);

privateRouter.get("/templates", authMiddleware, getTemplates);

privateRouter.post("/transcribe", authMiddleware, payloadMiddleware(transcribeSchema), transcribe);

privateRouter.get("/cvs", authMiddleware, getCVs);

privateRouter.post("/image", authMiddleware, payloadMiddleware(imageSchema), uploadImage);

privateRouter.get("/image", authMiddleware, getImage);

privateRouter.delete("/image", authMiddleware, deleteImage);

module.exports = privateRouter;