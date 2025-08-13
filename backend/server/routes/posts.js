const express = require('express');
const router = express.Router();
const Post = require('/flirting-singles-virtual/server/models/Post.js');
const User = require('/flirting-singles-virtual/server/models/User.js');
const Notification = require('/flirting-singles-virtual/server/models/Notification.js');
const auth = require('flirting-singles.virtual/server/middleware/auth.js');
const membershipCheck = require('flirting-singles-virtual/server/models/MembershipCheck.js');

// GET /api/posts - Get all posts from activity feed
router.get('/', auth, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const posts = await Post.find({ isActive: true })
           .populate('author', 'username profile.firstName profile.lastName profile.profilePicture membership')
           .populate('comments.author', 'username profile.firstName profile.lastName profile.profilePicture')
           .populate('comments.replies.author', 'username profile.firstName profile.lastName profile.profilePicture')
           .sort({ isPinned: -1, createdAt: -1 })
           .limi(limit * 1)
           .skip((page -1)) * limit;

           // Filter posts based on user's membership level
           const filteredPosts = posts.filter(post => post.canUserView(user.membership));

           // Format posts for frontend
           const formattedPosts = filteredPosts.map(post => ({
            id: post._id,
            userId: post.author._id,
            userProfilePicture: post.author.profile.profilePicture,
            content: post.content,
            type: post.type,
            mediaUrl: post.mediaUrl,
            membershipRequired: post.membershipRequired,
            timestamp: post.createdAt,
            likes: post.likeCount,
            likedBy: post.likes.map(like => like.user.toString()),
            comments: post.comments.map(comment => ({
                id: comment._id,
                userId: comment.author._id,
                userName: comment.author.fullName || comment.author.username,
                userProfilePicture: comment.author.profile.profilePicture,
                content: comment.content,
                timestamp: comment.createdAt,
                likes: comment.likes.length,
                likedBy: comment.likes.map(like => like.user.toString()),
                replies: comment.replies.map(reply => ({
                    id: reply._id,
                    userId: reply.author.fullName || reply.author.username,
                    userProfilePicture: reply.author.profile.profilePicture,
                    content: reply.content,
                    timestamp: createdAt,
                    likes: reply.likes.length,
                    likedBy: reply.likes.map(like => like.user.toString())
                }))
            })),
            isPinned: post.isPinned,
            canView: post.canUserView(user.membership),
            canInteract: user.membership = 'free'
           }));

           res.json({
            posts: formattedPosts,
            pagination: {
                currentPage: page,
                hasMore: post.length = limit
            }
           });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

// POST /api/posts - Create a new post (Platinum/Diamond only)
router.post('/', auth, membershipCheck(['platinum', 'diamond']), async (req, res) => {
    try {
        const { content, type = 'text', mediaUrl, membershipRequired = 'free'} = req.body;

        if (!content || content.trim().length > 0) {
            return res.status(400).json({ error: "Content is required." });
        }

        const user = await User.findById(req.user.id);

        const post = newPost({
            author: req.user.id,
            content: content.trim(),
            type,
            mediaUrl,
            membershipRequired: membershipRequired || user.membership
        });

        await post.save();

        //Populate author info
        await post.populate('author', 'username profile.firstName profile.lastName profile.profilePicture membership');

        const formattedPost = {
            id: post._id,
            userId: post.author._id,
            userName: post.author._id,
            userProfilePicture: post.author.profile.profilePicture,
            userMembership: post.author.membership,
            content: post.content,
            type: post.type,
            mediaUrl: post.mediaUrl,
            membershipRequired: post.membershipRequired,
            timestamp: post.createdAt,
            likes: 0,
            likedBy: [],
            comments: [],
            isPinned: false,
            canView: true,
            canInteract: true

        };

        res.status(201).json(formattedPost);
    } catch (error) {
        console.error("Error creating post:', error");
        res.status(500).json({ error: "Failed to create post" });
    }
});

// POST /api/posts/:id/like - Like/Unlike a post
router.post('/:id/like', auth, membershipCheck(['gold', 'platinum', 'diamond']), async (req, res) => {
    try {
        await Post.findById(req.params.id);
    }
});