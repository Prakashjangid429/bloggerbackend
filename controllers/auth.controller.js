const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const dotenv = require('dotenv');

dotenv.config();

exports.register = async (req, res) => {
    const { full_name, email,mobile, password } = req.body;
    console.log(full_name)
    try{
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        user = new User({ full_name,mobile, email, password });
        const salt = await bcrypt.genSalt(10);
    
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        res.status(201).json({ token });
    }
    catch (err){
        console.log(err)
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const payload = { user: { id: user.id } };

        const token = jwt.sign(payload, process.env.JWT_SECRET);
        res.json({ token, message: "login successfully", status: true });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.viewProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.updateProfile = async (req, res) => {
    const { full_name, email, mobile, date_of_birth, address, country, social } = req.body;

    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.full_name = full_name || user.full_name;
        user.mobile = mobile || user.mobile;
        user.date_of_birth = date_of_birth || user.date_of_birth;
        user.address = address || user.address;
        user.country = country || user.country;
        user.social = social || user.social;

        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).send('Server error');
    }
};


