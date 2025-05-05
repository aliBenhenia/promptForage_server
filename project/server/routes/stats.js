const express = require('express');
const PromptRequest = require('../models/PromptRequest');
const router = express.Router();

// @route   GET /api/stats/usage
// @desc    Get user's usage statistics
// @access  Private
router.get('/usage', async (req, res) => {
  try {
    const user = req.user;
    
    // Get daily usage for the last 7 days
    const dailyUsage = await getDailyUsage(user._id, 7);
    
    // Get total requests
    const totalRequests = await PromptRequest.countDocuments({ user: user._id });
    
    // Get today's requests
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const requestsToday = await PromptRequest.countDocuments({
      user: user._id,
      createdAt: { $gte: today }
    });
    
    res.json({
      dailyUsage,
      totalRequests,
      requestsToday,
      requestLimit: user.requestLimit,
    });
  } catch (error) {
    console.error('Get usage stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper function to get daily usage
async function getDailyUsage(userId, days) {
  // Calculate start date (X days ago from today)
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (days - 1));
  startDate.setHours(0, 0, 0, 0);
  
  // Get requests aggregated by day
  const dailyRequests = await PromptRequest.aggregate([
    {
      $match: {
        user: userId,
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
  
  // Generate array for all days (including days with zero requests)
  const dailyUsage = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    
    const dayData = dailyRequests.find(item => item._id === dateString);
    dailyUsage.push({
      date: dateString,
      count: dayData ? dayData.count : 0
    });
  }
  
  return dailyUsage;
}

module.exports = router;