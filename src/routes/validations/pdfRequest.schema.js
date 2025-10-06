const Joi = require("joi");

const pdfRequestSchema = Joi.object({
    templateName: Joi.string().required().valid("harvard", "modern"),
});

module.exports = {
    pdfRequestSchema
};