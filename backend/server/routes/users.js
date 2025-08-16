const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser } = require('../middlewares/validateUser');
const { authenticate } = require('../middlewares/authenticate');
const { verifyFirebaseToken, checkMembership } = require('../middlewaresauth');
const upload = require('../middlewares/upload');

// ALl routes require authentication
router.use(authenticate);
router.use(verifyFirebaseToken);

// User profile routes
router.get('/profile/:userId?', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.post('/profile/photo', upload.single('photo'), userController.uploadProfilePhoto);
router.post('/profile/video', upload.single('video'), userController.uploadProfileVideo);
router.delete('/profile/photo', userController.deleteProfilePhoto);
router.delete('/profile/video', userController.deleteProfileVideo);

// User interactions
router.post('/like/:userId', userController.likeUser);
router.post('unlike/userId', userController.unlikeUser);
router.post('block/:userId', userController.blockUser);
router.post('unblock/:userId', userController.unblockUser);
router.post('/report/:userId', userController.reportUser);
router.post('/favorite/:userId', userController.favoriteUser);
router.post('/unfavorite/:userId', userController.unfavoriteUser);

// User search and discovery
router.get('/search', userController.searchUser);
router.get('/discover', userController.discoverUsers);

// Flirts and messages
router.get('/flirts/received', userController.getReceivedFlirts);
router.post('/flirts/send/:userId', userController.sendFlirt);
router.post('/flirts/sent', userController.getSentFlirts);
router.get('/flirts/refected', userController.getRejectedFlirts);

router.get('/messages/:userId', userController.getMessages);
router.post('messages/send/:userid', userController.sendMessage);
router.get('/messages/conversations', userController.getConversations);
router.get('/messages/unread', userController.getUnreadMessagesCount);
router.delete('/messages/:messageId', userController.deleteMessage);

// User settings
router.get('/settings', userController.getUserSettings);
router.put('/settings', userController.updateSettings);
router.put('/settings/notifications', userController.updateNotificationsSettings);
router.put('/settings/privacy', userController.updatePrivacySettings);

// User membership
router.get('/membership', userController.getMembershipStatus);

// User verification
router.post('/verify', userController.verifyUser);

// User feedback
router.post('/feedback', userController.submitFeedback);

// User account management
router.delete('/account', userController.deleteAccount);
router.post('/account/deactivate', userController.deactivateAccount);
router.post('/account/reactivate', userController.reactivateAccount);
router.post('/account/close', userController.closeAccount);
router.post('/account/close/confirm', userController.confirmCloseAccount);

// User notifications
router.get('/notifications', userController.getNotifications);
router.post('/notifications/mark-read', userController.markNotificationsRead);
router.delete('/notifications/:notificationId', userController.deleteNotification);
router.post('/notifications/subscribe', userController.subscribeToNotifications);
router.post('/notifications/unsubscribe', userController.unsubscribeFromNotifications);
router.post('/notifications/subscribe/topic', userController.subscribeToTopic);
router.post('/notifications/unsubscribe/topic', userController.unsubscribeFromTopic);
router.post('/notifications/send', userController.sendNotification);
router.post('/notifications/send/topic', userController.sendNotificationToTopic);

// User interactions with other users
router.get('/interactions/:userId', userController.getUserInteractions);
router.post('/interactions/like/:userId', userController.likeUserInteraction);
router.post('/interactions/unlike/:userId', userController.unlikeUserInteraction);
router.post('/interactions/block/:userId', userController.blockUserInteraction);
router.post('/interactions/unblock/:userId', userController.unblockUserInteraction);
router.post('/interactions/report/:userId', userController.reportUserInteraction);
router.post('/interactions/favorite/:userId', userController.favoriteUserInteraction);
router.post('/interactions/unfavorite/:userId', userController.unfavoriteUserInteraction);
router.post('/interactions/flirt/:userId', userController.flirtUserInteraction);
router.post('/interactions/message/:userId', userController.messageUserInteraction);
router.get('/interactions/flirts/received', userController.getReceivedFlirtInteractions);
router.post('/interactions/flirts/send/:userId', userController.sendFlirtInteraction);
router.post('/interactions/flirts/sent', userController.getSentFlirtInteractions);
router.get('/interactions/flirts/rejected', userController.getRejectedFlirtInteractions);

router.get('/interactions/messages/:userId', userController.getMessageInteractions);
router.post('/interactions/messages/send/:userId', userController.sendMessageInteraction);

module.exports = router;
