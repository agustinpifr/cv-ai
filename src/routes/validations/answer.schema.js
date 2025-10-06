const Joi = require("joi");

const postAnswerSchema = Joi.object({
    content: Joi.string().min(3).max(300).required(),    
    questionId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        'string.pattern.base': 'questionId debe ser un ObjectId válido de MongoDB'
    })
})

module.exports = {
    postAnswerSchema
};