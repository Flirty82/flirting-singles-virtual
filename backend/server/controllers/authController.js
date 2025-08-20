const User = require('flirting-singles-virtual/server/models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Helper function to send response
const sendTokenResponse = (user, statusCode, res, message) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: pocess.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };

    // Remove password from output
    user.password = undefined;

    res
      .status(statusCode)
      .cookie('token', token, options)
      .json({
        success: true,
        message,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            membershipType: user.membershipType,
            profileCompleted: user.profileCompleted,
            profileSetup: user.profileSetup,
            profilePicture: user.profilePicture,
            isVerified: user.isVerified
        }
      });
};

// @desc Register user
// @route POST /api/auth/register
// @access Public
exports.register = async (req, res) => [
    try {
        const {
            email,
            username,
            password,
            firstName,
            lastName,
            dateOfBirth,
            gender,
            membershipType = 'free'
        } = req.body;

        // Validate required fields
        if (!email || !username || !password || !firstName || !lastName || !dateOfBirth || !gender) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
            });
        }

        // Validate age (must be 18+)
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMouth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            return res.status(400).json({
                success: false,
                message: 'You must be 18 years  or older to register.'
            });
        }

        // Create user
        const user = await User.create({
            email,
            username,
            password,
            firstName,
            lastName,
            dateOfBirth,
            gender,
            membershipType,
            verificationToken: crypto.randomBytes(20).toString('hex')
        });

        // Determine next step based on membership type
        let nextStep = 'profile-setup';
        let message = 'Registration successful! Please complete your profile setup.';

        if (membershipType === 'free') {
            nextStep = 'payment';
            message = 'Registration successful! Please complete your payment to activate your premium membership.';
        }

        // Send response with token and next step
        res.status(201).json({
            success: true,
            message: ,
            nextStep,
            token: user.getSignedJwtToken
        })
    }
]