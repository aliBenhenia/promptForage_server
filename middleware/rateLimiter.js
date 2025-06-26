const PromptRequest = require('../models/PromptRequest');

// Middleware to check if user has reached their daily request limit
const checkRateLimit = async (req, res, next) => {
  try {
    const user = req.user;
    
    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Count requests made today
    const requestsToday = await PromptRequest.countDocuments({
      user: user._id,
      createdAt: { $gte: today }
    });
    
    // Check if user has reached their daily limit
    if (requestsToday >= user.requestLimit) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'You have reached your daily request limit',
        limit: user.requestLimit,
        used: requestsToday,
      });
    }
    
    // If not, proceed
    next();
  } catch (error) {
    console.error('Rate limiter error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = checkRateLimit;