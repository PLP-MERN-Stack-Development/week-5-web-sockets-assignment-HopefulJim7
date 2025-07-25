// 🔐 Required Imports
const User = require('../models/User');
const { hashPassword, comparePassword, generateToken, verifyToken } = require('../utils/authUtils');
const { isValidEmail, isNonEmptyString } = require('../utils/validators');
const logger = require('../utils/logger');

// 🚀 Register New User
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!isNonEmptyString(username) || !isValidEmail(email) || !isNonEmptyString(password)) {
    logger.error(`Invalid registration payload: ${JSON.stringify(req.body)}`);
    return res.status(400).json({ error: 'Invalid input' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const hashedPassword = await hashPassword(password);
  const newUser = await User.create({ username, email, password: hashedPassword });

  const token = generateToken({ id: newUser._id, username, email });
  logger.info(`User registered: ${email}`);
  res.status(201).json({ token });
};

// 🔑 User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!isValidEmail(email) || !isNonEmptyString(password)) {
    logger.error(`Invalid login payload: ${JSON.stringify(req.body)}`);
    return res.status(400).json({ error: 'Invalid input' });
  }

  const user = await User.findOne({ email });
  if (!user || !(await comparePassword(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken({ id: user._id, username: user.username, email });
  logger.info(`User logged in: ${email}`);
  res.status(200).json({ token });
};

// 🛡️ Secure Password Update (Authenticated Route)
exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user?.id;

  if (!isNonEmptyString(oldPassword) || !isNonEmptyString(newPassword)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const user = await User.findById(userId);
  if (!user || !(await comparePassword(oldPassword, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  user.password = await hashPassword(newPassword);
  await user.save();

  logger.info(`Password updated for user: ${user.email}`);
  res.status(200).json({ message: 'Password updated successfully' });
};

// 📩 Initiate Password Reset (Magic Link Token)
exports.initiatePasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const resetToken = generateToken({ id: user._id, email }, '15m');

  // TODO: Hook into SendGrid/Nodemailer
  logger.info(`Password reset token for ${email}: ${resetToken}`);
  res.status(200).json({ message: 'Reset link sent (mocked)', resetToken });
};

// 🔓 Password Reset via Token
exports.resetPasswordViaLink = async (req, res) => {
  const { token, newPassword } = req.body;
  const decoded = verifyToken(token);

  if (!decoded || !isNonEmptyString(newPassword)) {
    return res.status(400).json({ error: 'Invalid token or password' });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.password = await hashPassword(newPassword);
  await user.save();

  logger.info(`Password reset via link for ${decoded.email}`);
  res.status(200).json({ message: 'Password updated successfully' });
};