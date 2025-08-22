const Profile = require('../models/Profile');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id })
      .populate('userId', 'firstName lastName email phone dateOfBirth');
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstName,
      lastName,
      bio,
      location,
      interests,
      lookingFor,
      relationshipStatus
    } = req.body;

    // Update user basic info
    if (firstName || lastName) {
      await User.findByIdAndUpdate(req.user.id, {
        ...(firstName && { firstName }),
        ...(lastName && { lastName })
      });
    }

    // Update profile
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      {
        ...(bio && { bio }),
        ...(location && { location }),
        ...(interests && { interests }),
        ...(lookingFor && { lookingFor }),
        ...(relationshipStatus && { relationshipStatus })
      },
      { new: true, upsert: true }
    ).populate('userId', 'firstName lastName email phone dateOfBirth');

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add interest
exports.addInterest = async (req, res) => {
  try {
    const { interest } = req.body;
    
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { $addToSet: { interests: interest } },
      { new: true }
    );

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove interest
exports.removeInterest = async (req, res) => {
  try {
    const { interest } = req.body;
    
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { $pull: { interests: interest } },
      { new: true }
    );

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};