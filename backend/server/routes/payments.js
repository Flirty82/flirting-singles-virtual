// routes/payments.js
const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');
const User = require('../models/User');
const Payment = require('../models/Payment');
const auth = require('../middleware/auth');

// PayPal environment setup
const Environment = process.env.NODE_ENV === 'production' 
  ? paypal.core.LiveEnvironment 
  : paypal.core.SandboxEnvironment;

const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
);

// Membership pricing configuration
const MEMBERSHIP_PLANS = {
  gold: {
    name: 'Gold Membership',
    features: ['unlimited_flirts', 'music_sharing', 'priority_support'],
    pricing: {
      monthly: 9.99,
      yearly: 99.99
    }
  },
  platinum: {
    name: 'Platinum Membership',
    features: ['gold_features', 'create_posts', 'chat_rooms', 'unlimited_invites'],
    pricing: {
      monthly: 19.99,
      yearly: 199.99
    }
  },
  diamond: {
    name: 'Diamond Membership',
    features: ['platinum_features', 'virtual_dating', 'feedback_feature', 'vip_support'],
    pricing: {
      monthly: 29.99,
      yearly: 299.99
    }
  }
};

// POST /api/payments/create-order - Create PayPal order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { membershipType, billingCycle } = req.body;

    // Validate membership type and billing cycle
    if (!MEMBERSHIP_PLANS[membershipType]) {
      return res.status(400).json({ error: 'Invalid membership type' });
    }

    if (!['monthly', 'yearly'].includes(billingCycle)) {
      return res.status(400).json({ error: 'Invalid billing cycle' });
    }

    const plan = MEMBERSHIP_PLANS[membershipType];
    const amount = plan.pricing[billingCycle];

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount.toString()
        },
        description: `${plan.name} - ${billingCycle} subscription`,
        custom_id: `${req.user.id}_${membershipType}_${billingCycle}_${Date.now()}`
      }],
      application_context: {
        brand_name: 'Flirting Singles',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `${process.env.FRONTEND_URL}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
      }
    });

    const order = await paypalClient.execute(request);

    res.json({
      orderID: order.result.id,
      amount: amount,
      currency: 'USD'
    });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// POST /api/payments/verify-paypal - Verify and capture PayPal payment
router.post('/verify-paypal', auth, async (req, res) => {
  try {
    const { orderId, membershipType, billingCycle, paymentDetails } = req.body;

    // Validate inputs
    if (!orderId || !membershipType || !billingCycle) {
      return res.status(400).json({ error: 'Missing required payment information' });
    }

    if (!MEMBERSHIP_PLANS[membershipType]) {
      return res.status(400).json({ error: 'Invalid membership type' });
    }

    // Capture the PayPal order
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const capture = await paypalClient.execute(request);
    const captureResult = capture.result;

    // Verify payment status
    if (captureResult.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Get payment amount and verify it matches expected amount
    const paidAmount = parseFloat(captureResult.purchase_units[0].payments.captures[0].amount.value);
    const expectedAmount = MEMBERSHIP_PLANS[membershipType].pricing[billingCycle];

    if (Math.abs(paidAmount - expectedAmount) > 0.01) {
      return res.status(400).json({ error: 'Payment amount mismatch' });
    }

    // Calculate membership expiry date
    const now = new Date();
    const expiryDate = new Date(now);
    
    if (billingCycle === 'monthly') {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else if (billingCycle === 'yearly') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }

    // Update user membership
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.membership = membershipType;
    user.membershipExpiry = expiryDate;
    await user.save();

    // Create payment record
    const payment = new Payment({
      user: req.user.id,
      paymentMethod: 'paypal',
      paymentId: captureResult.id,
      orderId: orderId,
      membershipType: membershipType,
      billingCycle: billingCycle,
      amount: paidAmount,
      currency: 'USD',
      status: 'completed',
      paymentDetails: captureResult,
      membershipStart: now,
      membershipEnd: expiryDate
    });

    await payment.save();

    // Send confirmation email (optional)
    await sendPaymentConfirmationEmail(user, payment);

    res.json({
      success: true,
      membership: membershipType,
      membershipExpiry: expiryDate,
      paymentId: payment._id,
      message: 'Membership upgraded successfully!'
    });

  } catch (error) {
    console.error('Error verifying PayPal payment:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// GET /api/payments/history - Get user's payment history
router.get('/history', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select('membershipType billingCycle amount currency status createdAt membershipStart membershipEnd');

    const formattedPayments = payments.map(payment => ({
      id: payment._id,
      membershipType: payment.membershipType,
      billingCycle: payment.billingCycle,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      date: payment.createdAt,
      membershipPeriod: {
        start: payment.membershipStart,
        end: payment.membershipEnd
      }
    }));

    res.json(formattedPayments);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

// POST /api/payments/cancel-subscription - Cancel recurring subscription
router.post('/cancel-subscription', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // For one-time payments, we just update the user's intent to not renew
    // For actual recurring subscriptions, you would cancel the PayPal subscription here
    
    user.autoRenew = false;
    await user.save();

    res.json({
      success: true,
      message: 'Subscription set to not auto-renew. You will keep your current membership until it expires.'
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Webhook endpoint for PayPal notifications
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const event = req.body;
    
    // Verify webhook signature (recommended for production)
    // const isValid = await verifyPayPalWebhook(req.headers, event);
    // if (!isValid) {