const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    req.user = await User.findByPk(decoded.id);
    if (!req.user) return res.sendStatus(403);
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};
