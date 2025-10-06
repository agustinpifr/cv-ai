const express = require("express");
const { postLogin, postSignup } = require("../controllers/auth.controller");
const { payloadMiddleware } = require("../middlewares/payload.middleware");
const { userLoginSchema, userSignUpSchema } = require("./validations/user.schema");
const authRouter = express.Router();

authRouter.post("/login", payloadMiddleware(userLoginSchema), postLogin);
authRouter.post("/signup", payloadMiddleware(userSignUpSchema), postSignup);

module.exports = authRouter;