// backend/models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Message must have a sender']
  },
  
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Message must have a receiver']
  },
  
  // Message Content
  content: {
    type: String,
    required: function() {
      return this.messageType === 'text';
    },
    maxlength: [1000, 'Message cannot exceed 1000 characters'],
    trim: true
  },
  
  messageType: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'file', 'gif', 'sticker', 'location', 'contact'],
    default: 'text'
  },
  
  // Media attachments
  media: {
    url: String,
    publicId: String, // For Cloudinary
    filename: String,
    size: Number, // in bytes
    mimeType: String,
    thumbnail: String, // For videos
    duration: Number // For audio/video in seconds
  },
  
  // Location data (if messageType is 'location')
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
    placeName: String
  },
  
  // Contact data (if messageType is 'contact')
  contact: {
    name: String,
    phone: String,
    email: String
  },
  
  // Message Status
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  
  // Read receipts
  readBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now }
  }],
  
  deliveredAt: Date,
  readAt: Date,
  
  // Message reactions
  reactions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    emoji: String,
    reactedAt: { type: Date, default: Date.now }
  }],
  
  // Reply to another message
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  
  // Forward information
  forwardedFrom: {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    originalMessageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
  },
  
  // Message flags
  isEdited: {
    type: Boolean,
    default: false
  },
  
  editHistory: [{
    content: String,
    editedAt: { type: Date, default: Date.now }
  }],
  
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  deletedFor: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date, default: Date.now }
  }],
  
  // Moderation
  isReported: {
    type: Boolean,
    default: false
  },
  
  reports: [{
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: {
      type: String,
      enum: ['spam', 'inappropriate', 'harassment', 'fake', 'other']
    },
    description: String,
    reportedAt: { type: Date, default: Date.now }
  }],
  
  // Premium features
  isHighPriority: {
    type: Boolean,
    default: false
  },
  
  scheduledFor: Date, // For scheduled messages (premium feature)
  
  // Message encryption (for future implementation)
  isEncrypted: {
    type: Boolean,
    default: false
  },
  
  encryptionKey: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Conversation schema for grouping messages
const conversationSchema = new mongoose.Schema({
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    joinedAt: { type: Date, default: Date.now },
    leftAt: Date,
    role: { type: String, enum: ['member', 'admin'], default: 'member' }
  }],
  
  conversationType: {
    type: String,
    enum: ['direct', 'group'],
    default: 'direct'
  },
  
  // Group conversation details
  groupName: String,
  groupDescription: String,
  groupImage: String,
  groupSettings: {
    onlyAdminsCanMessage: { type: Boolean, default: false },
    allowMemberInvites: { type: Boolean, default: true },
    allowFileSharing: { type: Boolean, default: true }
  },
  
  // Last message info for quick access
  lastMessage: {
    content: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: Date,
    messageType: String
  },
  
  // Conversation status
  isActive: {
    type: Boolean,
    default: true
  },
  
  isArchived: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    archivedAt: { type: Date, default: Date.now }
  }],
  
  isMuted: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    mutedUntil: Date,
    mutedAt: { type: Date, default: Date.now }
  }],
  
  isBlocked: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    blockedAt: { type: Date, default: Date.now }
  }],
  
  // Typing indicators
  typingUsers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    startedTyping: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Message virtuals
messageSchema.virtual('isRead').get(function() {
  return this.status === 'read';
});

messageSchema.virtual('canBeDeleted').get(function() {
  // Messages can be deleted within 24 hours
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.createdAt > oneDayAgo;
});

// Message methods
messageSchema.methods.markAsRead = function(userId) {
  if (this.sender.toString() !== userId.toString()) {
    this.status = 'read';
    this.readAt = new Date();
    
    // Add to readBy array if not already there
    const alreadyRead = this.readBy.some(
      read => read.user.toString() === userId.toString()
    );
    
    if (!alreadyRead) {
      this.readBy.push({ user: userId });
    }
  }
};

messageSchema.methods.addReaction = function(userId, emoji) {
  // Remove existing reaction from this user
  this.reactions = this.reactions.filter(
    reaction => reaction.user.toString() !== userId.toString()
  );
  
  // Add new reaction
  this.reactions.push({ user: userId, emoji });
};

messageSchema.methods.removeReaction = function(userId) {
  this.reactions = this.reactions.filter(
    reaction => reaction.user.toString() !== userId.toString()
  );
};

messageSchema.methods.deleteForUser = function(userId) {
  const alreadyDeleted = this.deletedFor.some(
    deleted => deleted.user.toString() === userId.toString()
  );
  
  if (!alreadyDeleted) {
    this.deletedFor.push({ user: userId });
  }
  
  // If deleted for all participants, mark as deleted
  if (this.deletedFor.length >= 2) { // Assuming direct conversation
    this.isDeleted = true;
  }
};

// Conversation virtuals
conversationSchema.virtual('participantCount').get(function() {
  return this.participants.filter(p => !p.leftAt).length;
});

conversationSchema.virtual('isDirectConversation').get(function() {
  return this.conversationType === 'direct';
});

// Conversation methods
conversationSchema.methods.addParticipant = function(userId, role = 'member') {
  const existingParticipant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (existingParticipant) {
    if (existingParticipant.leftAt) {
      // Re-add participant who previously left
      existingParticipant.leftAt = undefined;
      existingParticipant.joinedAt = new Date();
    }
  } else {
    this.participants.push({ user: userId, role });
  }
};

conversationSchema.methods.removeParticipant = function(userId) {
  const participant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (participant) {
    participant.leftAt = new Date();
  }
};

conversationSchema.methods.updateLastMessage = function(message) {
  this.lastMessage = {
    content: message.content,
    sender: message.sender,
    timestamp: message.createdAt,
    messageType: message.messageType
  };
};

conversationSchema.methods.isParticipant = function(userId) {
  return this.participants.some(
    p => p.user.toString() === userId.toString() && !p.leftAt
  );
};

conversationSchema.methods.isMutedFor = function(userId) {
  const mutedEntry = this.isMuted.find(
    m => m.user.toString() === userId.toString()
  );
  
  if (!mutedEntry) return false;
  
  // Check if mute has expired
  if (mutedEntry.mutedUntil && mutedEntry.mutedUntil < new Date()) {
    return false;
  }
  
  return true;
};

// Indexes for performance
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ status: 1 });
messageSchema.index({ createdAt: -1 });

conversationSchema.index({ 'participants.user': 1 });
conversationSchema.index({ conversationType: 1 });
conversationSchema.index({ 'lastMessage.timestamp': -1 });

// Static methods
messageSchema.statics.getConversationMessages = function(conversationId, limit = 50, skip = 0) {
  return this.find({ 
    conversation: conversationId,
    isDeleted: false
  })
  .populate('sender', 'firstName lastName username profilePicture')
  .populate('receiver', 'firstName lastName username profilePicture')
  .populate('replyTo', 'content sender createdAt')
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(skip);
};

conversationSchema.statics.findOrCreateDirectConversation = async function(user1Id, user2Id) {
  // Try to find existing conversation
  let conversation = await this.findOne({
    conversationType: 'direct',
    'participants.user': { $all: [user1Id, user2Id] },
    'participants': { $size: 2 }
  });
  
  if (!conversation) {
    // Create new conversation
    conversation = await this.create({
      participants: [
        { user: user1Id },
        { user: user2Id }
      ],
      conversationType: 'direct'
    });
  }
  
  return conversation;
};

// Create models
const Message = mongoose.model('Message', messageSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = { Message, Conversation };