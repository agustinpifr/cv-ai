const { INVALID_PAYLOAD_MESSAGE } = require("../utils/constants");

const payloadMiddleware = (schema) => {
    return (req, res, next) => {
        const { body } = req;
        const { error } = schema.validate(body);

        if(error){
            res.status(403).json({
                message: INVALID_PAYLOAD_MESSAGE + error
            });
            return;
        }
        next();
    }
}

module.exports = {
    payloadMiddleware
}