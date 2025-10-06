const User = require("../models/user.models");
const bcrypt = require("bcrypt");

const findUser = async (username, password) => {
    const user = await User.findOne({ username });
    if(!user){
        return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return null;
    }
    return user;
}

const findUserByUsername = async (username) => {
    const user = await User.findOne({ username });
    return user;
}

const saveUser = async (username, password, age) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user =  new User ({ username, password: hashedPassword, age });
    return await user.save();
}

module.exports = {
    findUser,
    findUserByUsername,
    saveUser
}