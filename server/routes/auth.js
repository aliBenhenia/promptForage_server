const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const send2FACode = require('../utils/email').send2FACode;
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
     console.log('Registering user:', { name, email, password });
    
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create new user
    user = new User({
      name,
      email,
      password,
    });
    
    await user.save();
    
    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );
    
    // Return user without password and token
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        requestsUsed: 0,
        requestLimit: user.requestLimit,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login a user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    if (user.is2FAEnabled){
      // Generate 2FA code and send email
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      user.email2Facode = code;
      user.emailExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();
      // Send email with code (pseudo-code)
      // await sendEmail(user.email, 'Your 2FA code', `Your code is ${code}`);
      send2FACode(user.email, code)
        .then(() => {
          console.log('2FA code sent successfully');
        })
        .catch((error) => {
          console.error('Error sending 2FA code:', error);
        });
      return res.status(200).json({ message: '2FA code sent to email' ,user:
        {
          id: user._id,
          name: user.name,
          email: user.email,
          requestsUsed: 0,
          requestLimit: user.requestLimit,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          is2FAEnabled: user.is2FAEnabled,
        },
        token: null,
      });
    }
    
    // Check if password matches
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );
    
    // Return user without password and token
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        requestsUsed: 0, // This would be calculated
        requestLimit: user.requestLimit,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        is2FAEnabled: user.is2FAEnabled,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    // Get user info
    const user = req.user;
    
    // Return user info
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
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
// @route   POST /api/auth/2fa
// @desc    Enable 2FA
router.post('/toggle-2fa', require('../middleware/auth'), async (req, res) => {
  try {
    const user = req.user;
    const { enable } = req.body;
    if (enable === undefined)
      return res.status(400).json({ error: 'Enable flag is required' });
    user.is2FAEnabled = enable;
    await user.save();
    res.status(200).json({ message: `2FA ${enable ? 'enabled' : 'disabled'}` ,is2FAEnabled:user.is2FAEnabled});
    // res.json({ message: `2FA ${enable ? 'enabled' : 'disabled'}` });
  } catch (error) {
    console.error('Toggle 2FA error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get("/2fa-status", require("../middleware/auth"), async (req, res) => {
  try {
    const user = req.user;
    res.json({ is2FAEnabled: user.is2FAEnabled });
  } catch (error) {
    console.error("Get 2FA status error:", error);
    res.status(500).json({ error: "Server error" });
  }
});
router.post(
  "/verify-2fa",
  async (req, res) => {
   // verify user from userid come with body
   const { userId, code } = req.body;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }
      // Check if code is valid and not expired
      if (user.email2Facode !== code || Date.now() > user.emailExpiry) {
        return res.status(400).json({ error: "Invalid or expired code" });
      }
      // Clear 2FA code and expiry
      user.email2Facode = null;
      user.emailExpiry = null;
      await user.save();
      // Create JWT token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || "your_jwt_secret",
        { expiresIn: "7d" }
      );
      res.json({
        message: "2FA verified successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          requestsUsed: 0,
          requestLimit: user.requestLimit,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          is2FAEnabled: user.is2FAEnabled,
        },
      });
    } catch (error) {
      console.error("Verify 2FA error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);


const axios = require('axios');

// @route   GET /api/auth/github
// @desc    Redirect to GitHub OAuth
router.get('/github', (req, res) => {
  const clientId = "Ov23lic0HqtUxAk8MZ1w";
  const redirectUri = "https://promptforge-production-f875.up.railway.app/api/auth/github/callback";
  const scope = 'user:email';

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  res.redirect(githubAuthUrl);
});

// @route   GET /api/auth/github/callback
// @desc    GitHub OAuth callback
router.get('/github/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    // 1. Get GitHub access token
    const tokenResponse = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      return res.status(400).json({ error: 'Failed to retrieve access token' });
    }

    // 2. Get user info
    const githubUser = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    const { login, email: primaryEmail, name } = githubUser.data;

    // 3. Get public email if not present
    let email = primaryEmail;
    if (!email) {
      const emailsRes = await axios.get('https://api.github.com/user/emails', {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      });
      const primary = emailsRes.data.find((e) => e.primary && e.verified);
      email = primary?.email || `${login}@github.local`; // fallback
    }

    // 4. Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Register new user
      user = new User({
        name: name || login,
        email,
        password: Math.random().toString(36).slice(-8), // dummy password
      });
      await user.save();
    }

    // 5. Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: '7d',
    });

    // 6. Send token + user
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        requestsUsed: 0,
        requestLimit: user.requestLimit,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        is2FAEnabled: user.is2FAEnabled,
      },
      token,
    });
  } catch (error) {
    console.error('GitHub auth error:', error);
    res.status(500).json({ error: 'GitHub authentication failed' });
  }
});

module.exports = router;