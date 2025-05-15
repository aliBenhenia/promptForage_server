const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', async (req, res) => {
  try {
    const { name, email , password} = req.body;
    const user = req.user;
    
    // Check if email is already taken (if changing email)
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }
    // Update user
    user.name = name || user.name;
    user.email = email || user.email;
    user.updatedAt = Date.now();
    
    await user.save();
    
    // Return updated user
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      requestsUsed: 0, // This would be calculated
      requestLimit: user.requestLimit,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/user/password
// @desc    Update user password
// @access  Private
router.put('/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get user with password
    const user = await User.findById(req.user._id).select('+password');
    
    // Check if current password is correct
    if (!currentPassword || !newPassword)
      return res.status(400).json({ error: 'Current password and new password are required' });
    if (currentPassword === newPassword)
      return res.status(400).json({ error: 'New password cannot be the same as current password' });
    if (newPassword.length < 6)
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    user.updatedAt = Date.now();
    
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;