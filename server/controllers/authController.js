const User = require ('../models/User');
const JWT = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        //check if user exists
        const existing = await User.findOne({ email });
        if(existing) return res.status(400).json ({ message: 'User already exists' });

        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ error: err.message});
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne( { email });
        if(!user) return res.status(400).json({ message: 'Invalid credentials'});
        const token = JWT.sign({ userId: user._id}, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { register, login };