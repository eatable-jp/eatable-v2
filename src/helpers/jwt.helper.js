require("dotenv").config();
const jwt = require('jsonwebtoken');

const createJWT = async (id) => {
    const accessJWT =  jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
    return accessJWT
}


const verifyAcessJWT = userJWT => {
    return jwt.verify(userJWT, process.env.JWT_ACCESS_SECRET)
}

module.exports = {
    createJWT,
    verifyAcessJWT,
}