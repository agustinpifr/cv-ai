const Joi = require("joi");

const postQuestionSchema = Joi.object({
    content: Joi.string().min(3).max(300).required(),
});

module.exports = {
    postQuestionSchema
}