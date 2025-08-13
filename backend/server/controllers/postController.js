const { collections, FieldValue } = require('../config/firebase');

const postController = {
    // Get feed posts
    getFeedPosts: async (req, res) => {
        try {
            const userId = req.userId;
            const { limit = 20, startAfter } = req.query;

            let query = collections.getFeedPosts
              .orderBy('createdAt', 'desc')
              .limit(parseInt(limit));

              if (startAfter) {
                const startDoc = await collections.posts.doc(startAfter).get();
                query = query.startAfter(startDoc);
              }

              const snapshot = await query.get();
              const posts = [];

              for (const doc of snapshot.docs) {
                const postData = doc.data();

                // Get author details
                const authorDoc = await collections.users.doc(postData.userId).get();
                const author = authorDoc.data();

                posts.push({
                    id: doc.id,
                    ...postData,
                    author: {
                        id: author.uid,
                        name: author.displayName,
                        avatar: author.profile?.photos?.[0]?.url || null,
                        membershipLevel: author.membershipLevel
                    }
                });
              }

              res.json(posts);
        } catch (error) {
            console.error('Get feed posts error:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // Create a post
    createPost: async (req, res) => {
        try {
            const userId = req.userId;
            const { content, privacy = 'public' } = req.body;
            const media = req.files || [];

            const post = await collections.posts.add({
                userId,
                content,
                privacy,
                media: media.map(file => ({
                    url: file.path,
                    type: file.mimetype
                })),
                likes: 0,
                comments: 0,
                shares: 0,
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTImestamp()
            });

            res.status(201).json({
                id: post.id,
                message: "Post created successfully!"
            });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: error.message});
    }
},

// Like post
likePost: async (req, res) => {
    try {
        const userId = req.userId;
        const { postId } = req.params;

        // Check if already liked
        const existingLike = await collections.activities
        .where('type', '==' 'post_like')
        .where('userId', '==', userId)
        .where('postId', '==', postId)
        .get();

        if (!existingLike.empty) {
            return res.status(400).json({ error: "Already liked this post." });
        }

        // Add like activity
        await collections.activities.add({
            type: 'post_like',
            userId,
            postId,
            timestamp: FieldValue.serverTimestamp()
        });

        // Update post likes count
        await collections.posts.doc(postId).update({
            likes: FieldValue.increment(1)
        });

        res.json({ message: "Post liked successfully"};
    } catch (error) {
        console.error('Like post error:', error);
        res.status(500).json({ error: error.message });
    }
},

// Add comment 
addComment: async (req, res) => {
    try {
        const userId = req.userId;
        const { postId } = req.params;
        const { content } = req.body;

        const comment = {
            userId,
            postId,
            content,
            likes: 0,
            createdAt: FieldValue.serverTimestamp()
        };

        const commentDoc = await collections.comments.add(comment);
    }
}