const jwt = require("jsonwebtoken");

const generateToken = (userID) => {
    return jwt.sign({_id: userID}, process.env.JWT_SECRET, {expiresIn: "30d"});
}

module.exports = {generateToken};