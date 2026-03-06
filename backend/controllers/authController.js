const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_super_secret_dev_key', {
        expiresIn: '30d',
    });
};

const register = async (req, res) => {
    try {
        const { name, email, password, whatsapp, linkedin } = req.body;

        if (!name || !email || !password || !whatsapp) {
            return res.status(400).json({ success: false, message: 'Please provide name, email, password, and whatsapp' });
        }

        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            whatsapp,
            linkedin
        });

        if (user) {
            res.status(201).json({
                success: true,
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    token: generateToken(user.id),
                }
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("LOGIN ATTEMPT - Body received:", req.body);
        const user = await User.findOne({ where: { email } });
        console.log("LOGIN DB SEARCH - User found:", user ? user.email : 'null');

        if (!user) {
            console.log("LOGIN FAILED - User not found.");
            return res.status(401).json({ success: false, message: 'Invalid credentials: User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("LOGIN BCRYPT - Password Match:", isMatch);

        if (isMatch) {
            res.json({
                success: true,
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    token: generateToken(user.id),
                }
            });
        } else {
            console.log("LOGIN FAILED - Password Mismatch.");
            res.status(401).json({ success: false, message: 'Invalid credentials: Password incorrect' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // A simple token approach for demo purposes, normally you'd use crypto
        const resetToken = Math.random().toString(36).substring(2, 15);
        user.resetToken = resetToken;
        user.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
        await user.save();

        // In a real app, send an email. For this required task, we'll just return the token to simulate.
        res.json({ success: true, message: 'Reset token generated (simulated email)', token: resetToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await User.findOne({
            where: {
                resetToken: token,
                // Normally you'd also check expiry here, skipped for simple implementation if not strictly necessary, but let's add simple check
            }
        });

        // Add proper expiry check
        if (!user || user.resetTokenExpiry < new Date()) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { register, login, forgotPassword, resetPassword };
