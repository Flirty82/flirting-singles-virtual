const express = require('express');
const router = express.Router();
const Post = require('/flirting-singles-virtual/server/models/Post.js');
const User = require('/flirting-singles-virtual/server/models/User.js');
const Notification = require('/flirting-singles-virtual/server/models/Notification.js');
const auth = require('flirting-singles.virtual/server/middleware/auth.js');
const membershipCheck = require('flirting-singles-virtual/server/models/MembershipCheck.js');
const postController = require('flirting-singles-virtual/server/controllers/postController.js');
const { validatePost } = require('flirting-singles-virtual/server/validators/postValidator.js');

router.post('/create', auth, membershipCheck, validatePost, postController.createPost);
router.get('/all', postController.getAllPosts);
router.get('/user/:userId', postController.getPostsByUser);
router.get('/:postId', postController.getPostById);
router.put('/update/:postId', auth, membershipCheck, validatePost, postController.updatePost);
router.delete('/delete/:postId', auth, membershipCheck, postController.deletePost);
router.post('/like/:postId', auth, postController.likePost);
router.post('/comment/:postId', auth, postController.commentOnPost);
router.get('/notifications', auth, postController.getPostNotifications);
router.post('/report/:postId', auth, postController.reportPost);
router.get('/search', postController.searchPosts);
router.get('/trending', postController.getTrendingPosts);
router.get('/featured', postController.getFeaturedPosts);
router.get('/recent', postController.getRecentPosts);
router.get('/category/:category', postController.getPostsByCategory);
router.get('/tag/:tag', postController.getPostsByTag);
router.get('/stats', auth, postController.getPostStats);
router.post('/upload-image', auth, postController.uploadPostImage);
router.post('save-draft', auth, postController.saveDraft);
router.get('/drafts', auth, postController.getDrafts);
router.delete('/draft/:draftId', auth, postController.deleteDraft);
router.post('/share/:postId', auth, postController.sharePost);
router.post('/pin/:postId', auth, membershipCheck, postController.pinPost);
router.post('/unpin/:postId', auth, membershipCheck, postController.unpinPost);

router.post('/report-comment/:commentId', auth, postController.reportComment);
router.get('/comments/:postId', postController.getCommentsByPost);

router.use(verifyFirebaseToken);

// Post CRUD operations
router.post('/create', auth, postController.createPost);
router.get('/all', postController.getAllPosts);
router.get('/user/:userId', postController.getPostsByUser);
router.get('/:postId', postController.getPostById);
router.put('/update/:postId', auth, postController.updatePost);
router.delete('/delete/:postId', auth, postController.deletePost);
router.post('/like/:postId', auth, postController.likePost);
router.post('/comment/:postId', auth, postController.commentOnPost);
router.get('/notifications', auth, postController.getPostNotifications);
router.post('/report/:postId', auth, postController.reportPost);
router.get('/search', postController.searchPosts);
router.get('/trending', postController.getTrendingPosts);

// Post interactions
router.get('/featured', postController.getFeaturedPosts);
router.get('/recent', postController.getRecentPosts);
router.get('/category/:category', postController.getPostsByCategory);
router.get('/tag/:tag', postController.getPostsByTag);
router.get('/stats', auth, postController.getPostStats);
router.post('/upload-image', auth, postController.uploadPostImage);
router.post('/save-draft', auth, postController.saveDraft);
router.post('/:postId/share', auth, postController.sharePost);
router.post('/pin/:postId', auth, membershipCheck, postController.pinPost);
router.post('/unpin/:postId', auth, membershipCheck, postController.unpinPost);
router.post('/report-comment/:commentId', auth, postController.reportComment);
router.get('/comments/:postId', postController.getCommentsByPost);

router.post('/drafts', auth, postController.saveDraft);
router.get('/drafts', auth, postController.getDrafts);
router.delete('/draft/:draftId', auth, postController.deleteDraft);
router.post('/share/:postId', auth, postController.sharePost);

// Comments
router.post('/comment/:postId', auth, postController.commentOnPost);
router.get('/comments/:postId', postController.getCommentsByPost);
router.post('/report-comment/:commentId', auth, postController.reportComment);

// Share
router.post('/share/:postId', auth, postController.sharePost);
router.post('/pin/:postId', auth, membershipCheck, postController.pinPost);
router.post('/unpin/:postId', auth, membershipCheck, postController.unpinPost);
router.post('/report/:postId', auth, postController.reportPost);
router.get('/notifications', auth, postController.getPostNotifications);

router.get('/stats', auth, postController.getPostStats);
router.post('/upload-image', auth, postController.uploadPostImage);
router.post('/save-draft', auth, postController.saveDraft);
router.get('/drafts', auth, postController.getDrafts);

module.exports = router;