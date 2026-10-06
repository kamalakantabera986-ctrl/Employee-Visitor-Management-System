const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

// Generate JWT Helper
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// 1. SIGN UP (Registration)
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role, department } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }

        const user = new User({
            name,
            email: email.toLowerCase().trim(),
            password,
            role: role || 'Receptionist',
            department: department || 'Reception / Front Desk'
        });

        await user.save();

        const token = generateToken(user);
        res.status(201).json({
            message: 'Account created successfully!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error signing up', error: err.message });
    }
});

// 2. SIGN IN (Login)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide both email and password.' });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = generateToken(user);
        res.status(200).json({
            message: 'Signed in successfully!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error signing in', error: err.message });
    }
});

// 3. CURRENT USER (Me)
router.get('/me', requireAuth, async (req, res) => {
    try {
        res.status(200).json({ user: req.user });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching profile', error: err.message });
    }
});

// 4. DEMO SEED (Ensures easy 1-click test user)
router.post('/seed-demo', async (req, res) => {
    try {
        const demoEmail = 'admin@ibm-visit.com';
        let demoUser = await User.findOne({ email: demoEmail });
        if (!demoUser) {
            demoUser = new User({
                name: 'Admin Receptionist',
                email: demoEmail,
                password: 'adminpassword123',
                role: 'Admin',
                department: 'Administration'
            });
            await demoUser.save();
        }
        const token = generateToken(demoUser);
        res.status(200).json({
            message: 'Demo credentials ready!',
            email: demoEmail,
            password: 'adminpassword123',
            token,
            user: {
                id: demoUser._id,
                name: demoUser.name,
                email: demoUser.email,
                role: demoUser.role,
                department: demoUser.department
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error setting up demo account', error: err.message });
    }
});

module.exports = router;
