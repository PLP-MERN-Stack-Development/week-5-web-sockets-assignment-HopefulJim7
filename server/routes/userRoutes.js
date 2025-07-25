const express = require('express');
const router = express.Router();
const userHandler = require('../handlers/userHandler');
const authMiddleware = require('../middlewares/authMiddleware.js');

router.post('/login', userHandler.login);
router.post('/register', userHandler.register);

router.post('/reset-password', userHandler.initiatePasswordReset);
router.post('/update-password-via-link', userHandler.resetPasswordViaLink);
router.patch('/password', authMiddleware, userHandler.updatePassword);



module.exports = router;

