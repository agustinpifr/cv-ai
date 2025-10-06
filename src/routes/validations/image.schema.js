const Joi = require("joi");

const imageSchema = Joi.object({
    image: Joi.string().required(),
});

module.exports = {
    imageSchema
}