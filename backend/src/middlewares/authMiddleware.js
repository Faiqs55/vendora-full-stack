const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded._id).select("-password");

      next();
    } catch (error) {
        res.status(401).json({msg: "Not Authorized, token Failed"});
    }
}else{
      res.status(401).json({msg: "Not Authorized, no token"});
  }
};

const checkAuth = async (req, res, next) => {
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id).select("-password");
  }
  next();
}

module.exports = {
    protect,
    checkAuth
}
