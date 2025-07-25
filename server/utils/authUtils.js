const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.hashPassword = async (password) => bcrypt.hash(password, 10);
exports.comparePassword = async (input, hashed) => bcrypt.compare(input, hashed);
exports.generateToken = (payload, expiresIn = '1h') => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};
