const express = require('express');
const { body, validattionResult } = require('express-validator');
const { db, admin } = require('../../config/firebase');
const router = express.Router();

// Get conversations for user
router.get('/conversations', async (req, res) => {
    try {
        const userId = req.user.uid;
        const conversationsSnashot = await db.collection('conversations')
        .where('participants', 'array-contains', userId)
        .get();

        const conversations = [];

        for (const doc of conversationsSnapshot.docs) {
            const conversationData = doc.data();

            // Get other participants information
            const otherParticipantId = conversationData.participants.find(id => id !== userId);
            const otherUserDoc = await db.collection('users').doc(otherParticipantId).get();
            const otherUserData = otherUserDoc.data();

            conversations.push({
                id: doc.id,
                ...conversationData,
                otherUser: {
                    id: otherUserDoc.id,
                    displayName: otherUserData.displayName,
                    photoURL: otherUserData.photoURL,
                    isOnline: otherUserData.isOnline
                }
            });
        }

        res.json({
            conversations
        });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({
            error: 'Failed to fetch conversations',
            message: error.message
        });
    }
});

// Send a message
router.post('/send', )[
    body('recipientId').isString().withMessage('Recipient ID is required'),
    body('text').isLenght({ min: 1, max: 500 }).withMessage('Message text must be between 1 and 500 characters'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { recipientId, text } = req.body;
            const senderId = req.user.uid;

            if (senderId === recipientId) {
                return res.status(400).json({
                    error: 'You cannot send a message to yourself'
                });
            }

            // Check if conversation exists
            const conversationQuery = await db.collection('conversations')
                .where('participants', 'array-contains', senderId)
                .where('participants', 'array-contains', recipientId)
                .get();

                let conversationDoc = null;

                for (const doc of conversationQuery.docs) {
                    if (doc.exists) {
                        conversationDoc = doc;
                        break;
                    }
                }

                let conversationId;

                if (!conversationDoc) {
                    // Create new conversation
                    const newConversation = {
                        participants: [senderId, recipientId],
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                        lastMessage: text,
                        lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
                        lastMessageSender: senderId
                        };

                        const conversationRef = await db.collection('conversations').add(newConversation);
                        conversationId = conversationRef.id;
                    } else {
                        conversationId = conversationDoc.id;

                        // Update last message information
                        await db.collection('conversations').doc(conversationId).update({
                            lastMessage: text,
                            lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
                            lastMessageSender: senderId
                        });
                    }

                    // Create message document
                    const messageData = {
                        conversationId,
                        senderId,
                        recipientId,
                        text,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        read: false
                    };

                    const messageRef = await db.collection('messages').add(messageData);

                    res.status(201).json({
                        id: messageRef.id,
                        conversationId,
                        message: 'Message sent successfully',
                        data: {
                            id: messageRef.id,
                            senderId,
                            recipientId,
                            text,
                            createdAt: messageData.createdAt,
                            read: messageData.read
                        }
                    });
                } catch (error) {
                    console.error('Send message error:', error);
                    res.status(500).json({
                        error: 'Failed to send message',
                        message: error.message
                    });
                }
    }
];

module.exports = router;