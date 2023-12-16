// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const secretKey = config.secretKey;



// user token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
};

// admin token
const authenticateAdminToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, admin) => {
    if (err) return res.sendStatus(403);

    req.admin = admin;
    next();
  });
};

module.exports = {
  authenticateToken,
  authenticateAdminToken,
};
