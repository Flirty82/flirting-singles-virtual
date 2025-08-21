const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        unique: true
    },
    role: {
        type: String,
        enum: [
            'user_management',
            'content_moderation',
            'payment_management',
            ',analytics_view',
            'system_settings',
            'dashboard_admin',
            'notification_management'
        ]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockedUntil: {
        type: date,
        default: null
    }
}, {
    timestamps: true
});

// Hash password before saving
adminUserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
adminUserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('AdminUser', adminUserSchema);
// Additional methods can be added here for user management, such as locking accounts after too many failed login attempts
// or methods for retrieving user roles and permissions.

