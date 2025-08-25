const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const passport = requrie('passport');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const admin = require('firebase-admin');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const session = require('express-session');
const { createServer } = require('http');
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is runnin!' });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    // Mock authentication - replace with real auth
    const user = {
        id: Date.now(),
        email: email,
        name: email.split('@')[0],
        membership: 'free'
    };
    res.json({ success: true, user });
});

app.post('api/auth/signup', (req, res) => {
    const userData = req.body;
    // Mock signup - replace with real auth
    const user = {
        id: Date.now(),
        email: userData.email,
        name: '${userData.firstName} ${userData.lastName}',
        membership: 'free'
    };
    res.json({ success: true, user });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log('User ${socket.id} joined room ${roomId}');
    });

    socket.on('send_message', (data) => {
        io.to(data.room).emit('receive_message', data);
    });

    socket.on('bingo_number_called', (data) => {
        io.emit('bingo_number_called', data);
});

socket.on('karaoke_song_change', (data) => {
    io.emit('karaoke_song_change', data);
});

socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
});
});

// Load environment variables
dotenv.config();

// Import middleware
const errorHandler = require('./middlware/errorHandler');
const { apiLimiter, authLimiter, messageLimiter, postLimiter } = require('./middleware/rateLimit');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const messageRoutes = require('./routes/messages');
const paymentRoutes = require('./routes/payments');
const uploadRoutes = require('./routes/uploads');
const notificationRoutes = require('./routes/notifications');

// Create Express app
const app = express();
const httpServer = createServer(app);

var admin = require('firebase-admin');
var serviceAccount = require('path|to|serviceAccountKey.json');
admin.initializeCertif({
    credential: admin.credential(serviceAccount),
    databaseURL: 'https://flirting-singles-virtual-default-rtdb.firebaseio.com'
});

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://locatlhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit eash IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later."
});
app.use('api/limiter');

// Body parsing middleware
app.use(express.json({ limi: '10mb'}));
app.use(expressurlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Static files (for uploaded content)
app.use('/uploads', express.static('uploads'));

// Serve React build files in production
if (process.env.NODE.ENV === 'production') {
    app.use(express.static(path.join(--dirname, '../client/build')));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/payments', paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    if (process.env.NODE.ENV === 'production') {
        res.sendFile(path.join(--dirname, '../client/build', 'index.html'));
    } else {
        res.json({
            message: "Dating Social Network API",
            version: '1.0.0',
            endpoints: {
                auth: '/api/auth',
                users: '/api/users',
                posts: '/api/posts',
                messages: '/api/messages',
                memberships: '/api/memberships',
                payments: '/api/payments'
            }
        });
    }
});

// Catch all handler for React Router (must be last)
if (process.env.NODE_ENV === 'profuction') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}

// 404 Handler for API routes
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: 'Cannot ${req.method} ${req.url}'
    });
});

// GLobal error handler (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

module .exports = app;