const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SecretKey = process.env.JWT_SECRET;
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No authentication token, access denied' });
    }
    
    // Verify token
    // geneaarte secret key random now
    // const secretKey = crypto.randomBytes(32).toString('hex');
    console.log('Secret Key:', process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Set user in request object
    
    req.user = user;
    
    next();
    // print 
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = auth;