const jwt = require("jsonwebtoken");

const generateJWT = (id) => {
    const {JWT_SECRET_KEY, JWT_EXPIRATION_TIME} = process.env;
    return jwt.sign({ id }, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRATION_TIME });
}

const verifyJWT = (token) => {
    try {
        const {JWT_SECRET_KEY} = process.env;
        return jwt.verify(token, JWT_SECRET_KEY);
    } catch (error) {
        return null;
    }
}

module.exports = {
    generateJWT,
    verifyJWT
}