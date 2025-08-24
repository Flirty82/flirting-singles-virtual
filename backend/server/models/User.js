const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: true,
        required: true,
        trim: true
    },
    dateOfBirth: {
        type: date,
        required: true,
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
    timestamps: true
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

module.exports = mongoose.model('User', userSchema);