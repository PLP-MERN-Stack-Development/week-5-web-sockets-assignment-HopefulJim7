const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'dev_secret';

module.exports = {
  generateToken: (payload, expiresIn = '1h') => {
    return jwt.sign(payload, secretKey, { expiresIn });
  },
  verifyToken: (token) => {
    try {
      return jwt.verify(token, secretKey);
    } catch (err) {
      return null;
    }
  },
};