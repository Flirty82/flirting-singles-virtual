const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: [
            'like',
            'super_like',
            'match',
            'message',
            'profile_view',
            'photo_like',
            'comment',
            'friend_request',
            'friend_accept',
            'status_update',
            'photo_upload',
            'profile_update',
            'gift_sent',
            'gift_received',
            'boost_activated',
            'achievement_unlocked',
            'event_joined',
            'group_joined',
        ]
    },
    actor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    target: {
        type: String,
        enum: ['User', 'Photo', 'Post', 'Comment', 'Event', 'Group']
    },
    id: mongoose.Schema.Types.Object
})
