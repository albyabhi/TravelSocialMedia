// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const secretKey = config.secretKey;

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken,
};
