const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: [6, 'Username must be at least 6 characters'],
        maxlength: [15, 'Username cannot exceed 15 characters']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        unique: true
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: true,
        required: [true, 'Last name is required'],
        trim: true
    },
    dateOfBirth: {
        type: date,
        required: [true, 'Date of birth is required']
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: ['male', 'female', 'prefer-not-to-say']
    },
    membershipType: {
        type: String,
        enum: ['free', 'gold', 'platinum', 'diamond'],
        default: 'free'
    },
    membershipExpiry: {
        type: Date,
        default: null
    },
    profileCompleted: {
        type: Boolean,
        default: false
    },
    profileSetupStep: {
        type: Number,
        default: 1,
        min: 1,
        max: 5
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isEmailVerificed: {
        type: Boolean,
        default: false
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    profile: {
        bio: { type: String, maxlength: 500 },
        location: String,
        interests: [String],
        photos: [{
            url: String,
            isPrimary: { type: Boolean, default: false }
        }]
    },
    // Profile Images
    profilePicture: {
        type: String,
        default: null
    },
    profileImages: [{
        url: String,
        publicId: String,
        isMain: { type: Boolean, default: false }
    }],
    privacy: {
        showAge: { type: Boolean, default: true },
        showLocation: { type: Boolean, default: true },
        showOnlineStatus: { type: Boolean, default: true },
        allowMessages: { type: String, enum: ['everyone', 'matches', 'no-one', 'you-only'], default: 'everyone' }
    },
    preferences: {
        ageRange: {
            min: { type: Number, default: 18 },
            max: { type: Number, default: 99 }
        }
    },
    // Social Features
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    stats: {
        profileViews: { type: Number, default: 0 },
        likesReceived: { type: Number, default: 0 },
        messagesReceived: { type: Number, default: 0 },
        flirtsReceived: { type: Number, default: 0 },
        flirtsSent: { type: Number, default: 0 },
        invitesReceived: { type: Number, default: 0 },
        invitesSent: { type: Number, default: 0 }
    },
    // Flirting Singles specific fields
    flirtsSent: [{
        to: { type: mongoose.Schema.Types.Object, ref: 'User' },
        message: String,
        receivedAt: { type: Date, default: Date.now },
        isRead: { type: Boolean, default: false }
    }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    favoriteUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    lastSeen: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for age calculation
userSchema.virtual('age').get(function() {
    if (!this.dateOfBirth) return null;
    const ageDifMs = Date.now() - this.dateOfBirth.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
});

// Virtual for location coordinates
userSchema.virtual('location.coordinates').get(function() {
    return this.location ? this.location.coordinates : null;
});

// Virtual for membership status
userSchema.virtual('isPremium').get(function() {
    return this.membershipType !== 'free' && this.isMembershipActivie();
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
    return '${this.profile.firstName} ${this.profile.lastName}'.trim();

});

// Method to check if user can accesss features
userSchema.methods.canAccess = function(requireMembership) {
    const membershipLevels = { free: 0, gold: 1, platinum: 2, diamond: 3 };
    return membershipLevels[this.membership]
};

// Method to check if membership is active
userSchema.methods.isMembershipActive = function() {
    if (this.membership === 'free') return true;
    return this.membershipExpiry && this.membership > new DataTransfer();
};

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Index for better performance
userSchema.index({ email: 1 }),
userSchema.index({ username: 1 }),
userSchema.index({ membershipType: 1 }),
userSchema.index({ isActive: 1, isVerified: 1 }),
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);