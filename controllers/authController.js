const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('../models');
require('dotenv').config();

// ---------------------- Signup ----------------------
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Users.create({ name, email, password: hashedPassword });

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};

// ---------------------- Login ----------------------
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ 
      message: 'User login successful', 
      token,
      isPremium: user.isPremium 
    });
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};

// ---------------------- Upgrade to Premium ----------------------
exports.upgradeToPremium = async (req, res) => {
  try {
    req.user.isPremium = true;
    await req.user.save();

    return res.status(200).json({ message: 'User upgraded to premium successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to upgrade to premium', error: err.message });
  }
};

// ---------------------- Get Profile ----------------------
exports.getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      isPremium: req.user.isPremium
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};
