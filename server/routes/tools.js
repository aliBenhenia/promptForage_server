const express = require('express');
const PromptRequest = require('../models/PromptRequest');
const checkRateLimit = require('../middleware/rateLimiter');
const promptForwarder = require('../utils/promptForwarder');
const router = express.Router();

// Tools data
const tools = [
  {
    id: 'explain-code',
    name: 'Explain Code from server',
    description: 'Get a clear explanation of what your code does',
    icon: 'code',
    placeholderPrompt: 'function calculateTotal(items) {\n  return items.reduce((sum, item) => sum + item.price, 0);\n}',
  },
  {
    id: 'fix-bug',
    name: 'Fix Bug',
    description: 'Identify and fix issues in your code',
    icon: 'bug',
    placeholderPrompt: 'function sortArray(arr) {\n  for(let i = 0; i < arr.length; i++) {\n    for(let j = 0; j < arr.length; j++) {\n      if(arr[i] < arr[j]) {\n        let temp = arr[i];\n        arr[i] = arr[j];\n        arr[j] = temp;\n      }\n    }\n  }\n}',
  },
  {
    id: 'generate-regex',
    name: 'Generate Regex',
    description: 'Create regular expressions for your needs',
    icon: 'code-2',
    placeholderPrompt: 'Create a regex to validate email addresses',
  },
];

// @route   GET /api/tools
// @desc    Get all available tools
// @access  Private
router.get('/', async (req, res) => {
  try {
    res.json(tools);
  } catch (error) {
    console.error('Get tools error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/tools/:id
// @desc    Get a specific tool
// @access  Private
// router.get('/history', async (req, res) => {
//   // console.log('Get history request received');
//   try {
//     const userId = req.query.userId;
    
//     const history = await PromptRequest.find({ user: userId })
//       .sort({ createdAt: -1 })
//       .limit(50);
//     console.log("==>",history)
//     res.json(history);
//     // retunrn mock data
//     // return res.json([
//     //   {
//     //     id: '1',
//     //     toolId: 'explain-code',
//     //     prompt: 'function calculateTotal(items) { return items.reduce((sum, item) => sum + item.price, 0); }',
//     //     response: 'This function calculates the total price of an array of items. It uses the reduce method to sum up the prices of each item.',
//     //     createdAt: new Date(),
//     //   },
//     //   {
//     //     id: '2',
//     //     toolId: 'fix-bug',
//     //     prompt: 'function sortArray(arr) { for(let i = 0; i < arr.length; i++) { for(let j = 0; j < arr.length; j++) { if(arr[i] < arr[j]) { let temp = arr[i]; arr[i] = arr[j]; arr[j] = temp; } } } }',
//     //     response: 'This function sorts an array in ascending order using a nested loop. It compares each element with every other element and swaps them if they are in the wrong order.',
//     //     createdAt: new Date(),
//     //   },
//     // ]);
//   } catch (error) {
//     console.error('Get history error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });
const mongoose = require('mongoose');

// router.get('/history', async (req, res) => {
//   try {
//     const userId = req.query.userId;

//     // Validate ObjectId
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ error: 'Invalid user ID format' });
//     }

//     // Query with properly cast ObjectId
//     const history = await PromptRequest.find({ user: new mongoose.Types.ObjectId(userId) })
//       .sort({ createdAt: -1 })
//       .limit(50);

//     res.json(history);
//   } catch (error) {
//     console.error('Get history error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

 const User = require('../models/User');
router.get('/history', async (req, res) => {
  try {
    const email = req.query.email;
    // decode email
    const decodedEmail = Buffer.from(email, 'base64').toString('utf-8');
    // email = decodedEmail;
    console.log("===>",email)

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find prompt history using user's _id
    const history = await PromptRequest.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(history);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.post('/history', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const history = await PromptRequest.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(history);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tool = tools.find(t => t.id === req.params.id);
    
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    
    res.json(tool);
  } catch (error) {
    console.error('Get tool error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/tools/:id/prompt
// @desc    Submit a prompt to a specific tool
// @access  Private
router.post('/:id/prompt', checkRateLimit, async (req, res) => {
  try {
    const { id } = req.params;
    const { prompt } = req.body;
    
    // Check if tool exists
    const tool = tools.find(t => t.id === id);
    
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    
    // Forward prompt to AI service
    const response = await promptForwarder.processPrompt(id, prompt);
    
    // Save request to database
    // console.log("hello")
    const promptRequest = new PromptRequest({
      user: req.user._id,
      toolId: id,
      prompt,
      response,
    });
    
    await promptRequest.save();
    
    // Return response
    res.json({ response });
  } catch (error) {
    console.error('Submit prompt error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/tools/history
// @desc    Get user's prompt request history
// @access  Private

module.exports = router;