const Joi = require("joi");

const userSignUpSchema = Joi.object({
    username: Joi.string().min(3).max(20).required(),
    password: Joi.string().alphanum().min(3).max(30).required(),
    age: Joi.number().min(1).max(120).required()
})

const userLoginSchema = Joi.object({
    username: Joi.string().min(3).max(20).required(),
    password: Joi.string().alphanum().min(3).max(30).required(),
})

module.exports = {
    userSignUpSchema,
    userLoginSchema
}