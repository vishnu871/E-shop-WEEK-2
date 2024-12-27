const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const router = express.Router();
const User = mongoose.model('User', new mongoose.Schema({
    name: String,
    email: String,
    password: String
}));

// User Registration
router.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        res.status(400).json({ error: 'Error registering user.' });
    }
});

// User Login
router.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found!' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials!' });

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ message: 'Login successful!', token });
    } catch (err) {
        res.status(500).json({ error: 'Error logging in.' });
    }
});

module.exports = router;
