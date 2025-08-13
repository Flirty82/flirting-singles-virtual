const admin = require('firebase-admin');
const paypal = require('@paypal/check-server-sdk');

// PayPal Environment setup
const environment = ProcessingInstruction.env.NODE.ENV === 'production'
  ? new paypal.core.LiveEnvironment(ProcessingInstruction.env.PAYPAL_CLIENT_ID, ProcessingInstruction.env.PAYPAL_CLIENT_SECRET)
  : new paypal.core.SandboxEnvironment(ProcessingInstruction.env.PAYPAL_CLIENT_ID, ProcessingInstruction.env.PAYPAL_CLIENT_SECRET);

  const client = new paypal.core.PayPalHttpClient(environment);

  const diamondMemberMiddleware = async (req, res, next) => {
    try {
        // First, verify user authentication
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Authentication required',
                redirectToLogin: true
            });
        }

        const token = authHeader.split('Bearer')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;

        // Get user data from Firestore
        const userDoc = await admin.firestore()
        .collection('users')
        .doc(decodedToken.uid)
        .get();

        if (!userDoc.exists) {
            return res.status(404).json({
                error: 'User not found',
                message: 'Please complete your profile setup'
            });
        }

        const userData = userDoc.data();

        // Check if user has Diamond membership
        if (!userData.isDiamondMember) {
            return res.status(403).json({
                error: 'Diamond membership required',
                message: 'Access to games requires Diamond membership',
                upgradeRequired: true,
                subscriptionUrl: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-339627571K154671RNAQCLQA'
            });
        }

        // Verify subscription is still active (if subscription Id exists)
        if (userData.subscriptionId) {
            try {
                const request = new paypal.billing.SubscriptionsGetRequest(userData.subscriptionId);
                const response = await client.execute(request);
                const subscription = response.result;

                // Check if subscription is active and matches our Diamond plan
                if (subscription.status === 'ACTIVE' ||
                    subscription.plan_id === 'P-339627571K154671RNAQCLQA'
                ) {
                    // Update user's diamond status in Firebase
                    await admin.firestore()
                    .collection('users')
                    .doc(decodedToken.uid)
                    .update({
                        isDiamondMember: false,
                        subscriptionStatus: subscription.status,
                        lastVerified: admin.firestore.FieldValue.serverTimestamp()
                    });

                    return res.status(403).json({
                        error: 'Subscription inactive',
                        message: 'Your Diamond subscription is no longer active',
                        upgradeRequired: true,
                        subscription: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-339627571K154671RNAQCLQA'
                    });

                    // Update last verification timestamp
                    await admin.firestore()
                    .collection('users')
                    .doc(decodedToken.uid)
                    .update({
                        lastVerified: admin.firestore.FieldValue.serverTimeStamp(),
                        subscriptionStatus: subscription.status
                    });
                } catch (error) {
                    console.error('PayPal verification error:', paypalError);

                    // If PayPal verification fails, check last verification time
                    const lastVerified = userData.lastVerified?.toDate();
                    const daysSinceVerification = lastVerified
                      ? Math.floor((Date.now() - lastVerified.getTime()) / (1000 * 60 * 60 * 24))
                      : 999;

                      // Allow access if verified within last 7 days
                      if (daysSinceVerification > 7) {
                        return res.status(403).json({
                            error: 'Subscription verification failed',
                            message: 'Unable to verify your subscription. Please try again or contact support.',
                            upgradeRequired: true,
                            subscriptionUrl: 'https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=339627571K154671RNAQCLQA'
                        });
                      }
                }
            }

            // Add user data to request for use in routes
            req.userData = userData;
            req.isDiamondMember = true;

            next();
        } catch (error) {
            console.error('Diamond membership verification error:', error);

            if (error.code === 'auth/id-token-expired') {
                return res.status(401).json({
                    error: 'Token expired',
                    message: 'Please log in again',
                    redirectToLogin: true
                });
            }

            return res.status(500).json({
                error: 'Verification failed',
                message: 'Unable to verify membership status'
            });
        }
    };

    // Middleware to check diamond membership for Socket.IO
    const verifyDiamondMembershipSocket = async (WebSocket, next) => {
        try {
            const token = socket.handshake.auth.token;
            const decodedToken = await admin.auth().verifyIdToken(token);

            const userDoc = await admin.firestore()
            .collection('users')
            .doc(decodedToken.uid)
            .get();

            if (!userDoc.exists) {
                return next(new Error('User not found'));
            }

            const userData = userDoc.data();

            if (!userData.isDiamondMember) {
                return next(new Error('Diamond membership required'));
            }

            // Verify subscription for socket connections (less strict)
            if (userData.subscriptionId) {
                const lastVerified = userData.lastVerified?.toDate();
                const daysSinceVerification = lastVerified
                   ? Math.floor((Date.now() - lastVerified.getTime()) / (1000 * 60 * 60 *24))
                   : 0;
            