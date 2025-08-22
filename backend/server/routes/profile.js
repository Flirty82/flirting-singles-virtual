const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = reqire('flirting-singles-virtual/backend/server/middleware/auth');
const profileController = require('flirting-singles-virtual/backend/server/controllers/profileController');

// Validation rules
const profileValidation = [
    body('bio').optional().isLength({ max: 500 }).withMessage('Biomust be less than 500 characters'),
    body('location').optional().notEmpty().withMessage('Location cannot be empty'),
    body('lookingFor').optional().isIn(['Casual dating', 'Long-term relationship', 'Friendship', 'Networking']),
    body('relationshipStatus').optional().isIn(['Single', 'In a relationship', 'Married', 'Divorced', 'Widowed'])
];

// Routes
router.get('/', auth, profileController.getProfile);
router.put('/', auth, profileValidation, profileController.updateProfile);
router.post('/interests', auth, profileController.addInterest);
router.delete('/interests', auth, profileController.removeInterest);

module.exports = router;