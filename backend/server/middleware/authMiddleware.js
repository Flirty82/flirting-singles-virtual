// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - requires authentication
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists'
      });
    }

    // Check if user account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account has been deactivated'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific membership types
exports.authorize = (...membershipTypes) => {
  return (req, res, next) => {
    if (!membershipTypes.includes(req.user.membershipType)) {
      return res.status(403).json({
        success: false,
        message: `This feature requires ${membershipTypes.join(' or ')} membership`
      });
    }
    next();
  };
};

// Check if user has completed profile setup
exports.requireCompleteProfile = (req, res, next) => {
  if (!req.user.profileCompleted) {
    return res.status(403).json({
      success: false,
      message: 'Please complete your profile setup first',
      redirectTo: 'profile-setup'
    });
  }
  next();
};

// Check if user is verified
exports.requireVerification = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email address first'
    });
  }
  next();
};

// Optional authentication - doesn't fail if no token
exports.optionalAuth = async (req, res, next) => {
  let token;

  // Check for token in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      const user = await User.findById(decoded.id);
      if (user && user.isActive) {
        req.user = user;
      }
    } catch (error) {
      // Token invalid, but continue without user
      console.log('Optional auth failed:', error.message);
    }
  }

  next();
};

// Check membership type helper
exports.isPremium = (req, res, next) => {
  const premiumTypes = ['gold', 'platinum', 'diamond'];
  if (!premiumTypes.includes(req.user.membershipType)) {
    return res.status(403).json({
      success: false,
      message: 'This feature requires a premium membership',
      upgradeRequired: true
    });
  }
  next();
};

// Check if membership is expired
exports.checkMembershipExpiry = async (req, res, next) => {
  try {
    const user = req.user;
    
    // Check if premium membership has expired
    if (user.membershipType !== 'free' && user.membershipExpiry) {
      if (new Date() > user.membershipExpiry) {
        // Downgrade to free membership
        await User.findByIdAndUpdate(user._id, {
          membershipType: 'free',
          membershipExpiry: null
        });
        
        // Update the request user object
        req.user.membershipType = 'free';
        req.user.membershipExpiry = null;
        
        return res.status(403).json({
          success: false,
          message: 'Your premium membership has expired. Please renew to continue using premium features.',
          membershipExpired: true
        });
      }
    }
    
    next();
  } catch (error) {
    console.error('Membership expiry check error:', error);
    next();
  }
};

// Rate limiting for auth routes
exports.authRateLimit = (req, res, next) => {
  // This would typically use express-rate-limit
  // For now, just pass through
  next();
};