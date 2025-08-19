const express = require('express');
const router = express.Router();
const Post = require('/flirting-singles-virtual/server/models/Post.js');
const User = require('/flirting-singles-virtual/server/models/User.js');
const Notification = require('/flirting-singles-virtual/server/models/Notification.js');
const auth = require('flirting-singles.virtual/server/middleware/auth.js');
const membershipCheck = require('flirting-singles-virtual/server/models/MembershipCheck.js');
const postController = require('flirting-singles-virtual/server/controllers/postController.js');
const { validatePost } = require('flirting-singles-virtual/server/validators/postValidator.js');
const { body, validationResult } = require('express-validator');
const { db, admin } = require('../services/firebaseAdmin.js');

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

// Get all posts
router.get('/', async (req, res) => {
    try {
        const { limit = 20, startAfter } = req.query;

        let query = db.collection('posts').orderBy('createdAt', 'desc').limit(parseInt(limit));

        if (startAfter) {
            const startAfterDoc = await db.collection('posts').doc(startAfter).get();
            query = query.startAfter(startAfterDoc);
        }

        const snapshot = await query.get();
        const posts = [];

        snapshot.forEach(doc => {
            posts.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.json({
            posts,
            hasMore: snapshot.size === parseInt(limit)
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    };
});

// Create a new post
router.post('/', [
    body('content').optional().isLength({ min: 1, max: 500 }).withMessage('Content must be between 1 and 500 characters'),
    body('type').isIn(['text', 'image', 'video']).withMessage('Invalid post type')

    ], async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: 'Validation failed', details: errors.array()})
            }
            } catch (error) {
            console.error('Error validating post:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    
        const { content, images = [], type = 'text' } = req.body;
        const userId = req.user.id;

        if (!content && images.length === 0) {
            return res.status(400).json({ error: 'Post must have content or images' });
        };
    
        const postData = {
            userId,
            content: content || '',
            images,
            type,
            likes: [],
            comments: [],
            likesCount: 0,
            shares: 0,
            commentsCount: 0,
            sharesCount: 0,
            createdAt: admin.firestore.FieldValue.server.timestamp(),
            updatedAt: admin.firestore.FieldValue.server.timestamp()
        };

        const docRef = await db.collection('posts').add(postData);
        const newPost = { id: docRef.id, ...postData };

        res.status(201).json({
            id: docRef.id,
            ...postData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

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
router.delete('/draft/:draftId', auth, postController.deleteDraft);
    });
    
module.exports = router;