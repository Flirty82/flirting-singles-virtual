const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    bio: {
        type: String,
        maxlength: 500
    },
    location: {
        type: String,
        required: true
    },
    interests: [{
        type: String,
        trim: true
    }],
    lookingFor: {
        type: String,
        enum: ['Casual dating', 'Long-term relationship', 'Friendship', 'Networking'],
        default: 'Long-term relationship'
    },
    relationshipStatus: {
        type: String,
        enum: ['Single', 'In a relationship', 'Married', 'Divorced', 'Widowed'],
        default: 'Single'
    },
    photos: [{
        url: String,
        publicId: String,
        isProfilePicture: {
            type: Boolean,
            default: false
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    profileViews: {
        type: Number,
        default: 0
    },
    isProfileComplete: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);