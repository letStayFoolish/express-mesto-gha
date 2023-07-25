const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../config');

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '7d' });
}

function checkToken(token) {
  if (!token) {
    return false;
  }

  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    return false;
  }
}

module.exports = { generateToken, checkToken };
