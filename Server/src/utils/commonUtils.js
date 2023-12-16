// src/utils/commonUtils.js
const generateToken = (user) => `${user.username}:${user.email}`;

module.exports = {
  generateToken,
};

