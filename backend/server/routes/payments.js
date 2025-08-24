// backend/routes/payments.js
const express = require('express');
const {
  getMembershipPlans,
  createMembershipPayment,
  executePayment,
  cancelSubscription,
  getPaymentHistory,
  upgradeMembership,
  handleWebhook
} = require('../controllers/paymentController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/plans', getMembershipPlans);
router.post('/webhook', handleWebhook); // PayPal webhook endpoint

// Protected routes
router.use(protect); // All routes below require authentication

router.post('/create', createMembershipPayment);
router.post('/execute', executePayment);
router.post('/upgrade', upgradeMembership);
router.get('/history', getPaymentHistory);

// Premium member routes
router.post('/cancel-subscription', authorize('gold', 'platinum', 'diamond'), cancelSubscription);

// Test route for development
if (process.env.NODE_ENV === 'development') {
  router.get('/test', (req, res) => {
    res.json({
      success: true,
      message: 'Payment routes working',
      user: req.user.username,
      membership: req.user.membershipType
    });
  });
}

module.exports = router;