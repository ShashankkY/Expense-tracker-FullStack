const jwt = require("jsonwebtoken");
const { Users } = require("../models");
require('dotenv').config();

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401); // Unauthorized

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Users.findByPk(decoded.id);

    if (!req.user) return res.sendStatus(403); // Forbidden

    next();
  } catch (err) {
    return res.sendStatus(403); // Invalid token
  }
};
