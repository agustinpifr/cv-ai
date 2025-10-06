const { UNAUTHORIZED_MESSAGE } = require("../utils/constants");
const authMiddleware = (req, res, next) => {
    const apiKey = req.header('Authorization');
    if(!apiKey) return res.status(401).json({
        message: UNAUTHORIZED_MESSAGE
    });
    const {verifyJWT} = require("../utils/jwt");
    const verified = verifyJWT(apiKey);
    if(!apiKey || !verified) {
        res.status(401).json({
            message: UNAUTHORIZED_MESSAGE
        });
        return;
    }
    req.userId = verified.id;
    next();
}

module.exports = authMiddleware;