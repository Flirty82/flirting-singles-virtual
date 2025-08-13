const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: [8, 'Username must be at least 8 characters.'],
        maxlength: [30, 'Username can not exceed 30 characters']
    },
    password: {
        type: String,
        required: true,
        unique: true,
        minlength: [8, 'Password must be at least 8 characters'],
        select: false // Fon't include password in queries by default
    },
    // Basic Profile Information
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required'],
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'prefer-not-to-say']
    },
    // Membership Information
    membershipType: {
        type: String,
        enum: ['free', 'gold', 'platinum', 'diamond'],
        default: 'free'
    },
    membershipExpiry: {
        type: Date,
        default: null
    },
    // Profile setup
    profileCompleted: {
        type: Boolean,
        default: false
    },
    profileSetUp: {
        type: Number,
        default: 1,
        min: 1,
        max: 5
    },
    // Account Status
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    passwordResetToken: String,
    passwordResetExpirty: Date,

    // Profile Images
    profilePicture: {
        type: String,
        default: null
    },
    profileImages: {
        url: String,
        publicId: String,
        isMain: { type: Boolean, default: false }
    },
    location: {
        city: String,
        state: String,
        country: String,
    },
    privacy: {
        showAge: { type: Boolean, default: true },
        showLocation: { type: Boolean, default: true },
        showOnlineStatus: { type: Boolean, default: true },
        allowMessages: { type: String, enum: ['everyone', 'matches', 'only-me'], defualt: 'everyone' }
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        default: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    blockedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    stats: {
        profileViews: { type: Number, default: 0 },
        likesReceived: { type: Number, default: 0 },
        messagesReceived: { type: Number, default: 0 },
        flirtsReceived: { type: Number, default: 0 }
    }

});

userSchema.virtual('age').get(function() {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

userSchema.virtual('fullName').get(function () {
    return '${this.firstName} ${this.lastName}';
});

userSchema.virtual('isPremium').get(function() {
    return ['gold', 'platinum', 'diamond'].includes(this.membershipType);
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
    const salt = await bcrypt.getSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
    } catch (error) {
        next(error);
    }
});

userSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('isOnline')) {
        this.lastActive = new Date();
    }
    next();
});

userSchem.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
    { id: this._id, username: this.username, membershipType: this.membershipType },
process.env.JWT_SECRET,
{expiresIn: process.env.JWT_EXPIRE}
    );
};

userSchema.methods.getResetPasswordToken = function() {
    const resetToken = require('crypto').randomBytes(20).toString('hex');

    this.passwordResetToken = require(crypto)
       .createHash('sha256')
       .update(resetToken)
       .digest('hex');

       this.passwordRestExpires = Date.now() + 10 * 60 * 1000;  // 10 minutes

       return resetToken;
};

userSchema.statics.getByMembershipType = function(membershipType) {
    return this.find({ membershipType, isActive: true });
};

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ membershipType: 1 });
userSchema.index({ 'location.coordinates': '2dshpere' });
userSchema.index({ isActive: 1, isVerified: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);