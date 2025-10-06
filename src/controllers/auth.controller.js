const { findUser, findUserByUsername, saveUser } = require("../repositories/user.repository");
const { generateJWT } = require("../utils/jwt");
const { SUCCESS_MESSAGE, UNAUTHORIZED_MESSAGE, ALREADY_EXISTS_MESSAGE } = require("../utils/constants");

const postLogin = async (req, res) => {
    const { body } = req;
    const { username, password } = body;
    console.log(username, password);
    const user = await findUser(username, password);

    if(!user){
        res.status(403).json({
            message: UNAUTHORIZED_MESSAGE
        })
        return;
    }
    const jwt = generateJWT(user._id);
    console.log(jwt);
    res.json({
        message: SUCCESS_MESSAGE,
        jwt
    });
}

const postSignup = async (req, res) => {
    const { body } = req;
    const { username, password, age } = body;
    const user = await findUserByUsername(username);
    if(user){
        res.status(403).json({
            message: ALREADY_EXISTS_MESSAGE
        })
        return;
    }

    const savedUser = await saveUser(username, password, age);
    const jwt = generateJWT(savedUser._id);
    console.log(jwt);
    res.status(201).json({  
        message: SUCCESS_MESSAGE,
        jwt
    })
}

module.exports = {
    postLogin, postSignup
}