const Joi = require("joi");

const transcribeSchema = Joi.object({
    audioBase64: Joi.string().required(),
    mimeType: Joi.string().required().valid(
        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "audio/webm",
        "audio/ogg",
        "audio/m4a",
        "audio/x-m4a",
        "audio/mp4"
    ),
    language: Joi.string().optional().default("es")
});

module.exports = {
    transcribeSchema
}


