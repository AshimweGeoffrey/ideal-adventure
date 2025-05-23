const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'portfolio_26466_secret_key';

// JWT Token Authentication
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token authentication error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// API Key Authentication
const authenticateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({ message: 'API key required' });
    }

    // Validate API key format
    if (!apiKey.startsWith('pk_26466_')) {
      return res.status(401).json({ message: 'Invalid API key format' });
    }

    const user = await User.findOne({ 
      apiKey: apiKey, 
      apiKeyActive: true,
      isActive: true 
    }).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid API key' });
    }

    req.user = user;
    req.apiKeyUsed = true;
    next();
  } catch (error) {
    console.error('API key authentication error:', error);
    return res.status(500).json({ message: 'Authentication error' });
  }
};

// Dual Authentication (JWT or API Key)
const authenticateTokenOrApiKey = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const apiKey = req.headers['x-api-key'];

  if (authHeader && authHeader.split(' ')[1]) {
    return authenticateToken(req, res, next);
  } else if (apiKey) {
    return authenticateApiKey(req, res, next);
  } else {
    return res.status(401).json({ 
      message: 'Authentication required - provide either Bearer token or API key' 
    });
  }
};

// Role-based authorization
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId, timestamp: Date.now() },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = {
  authenticateToken,
  authenticateApiKey,
  authenticateTokenOrApiKey,
  requireRole,
  generateToken
};
