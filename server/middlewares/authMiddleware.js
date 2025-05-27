// authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv=require("dotenv");
dotenv.config()

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
// console.log(token)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded)
    const user = await User.findById(decoded.userId);
// console.log(user)
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
