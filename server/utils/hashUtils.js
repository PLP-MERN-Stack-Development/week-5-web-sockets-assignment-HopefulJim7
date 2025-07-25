// server/utils/hashUtils.js
const bcrypt = require('bcrypt');

module.exports = {
  hashPassword: async (plainText) => await bcrypt.hash(plainText, 10),
  comparePassword: async (plainText, hash) => await bcrypt.compare(plainText, hash),
};
