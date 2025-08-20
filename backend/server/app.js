const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Import configurations
const connectDB = require('./config/database');
const { initializeFirebase } = require('./config/firebase');
const { configureSocket } = require('./config/socket');

// Import Middleware
const authMiddleware = require('flirting-singles-virtual/backend/server/middleware/auth');
const membershipMiddleware = require('flirting-singles-virtual/backend/server/middleware/membership');
const validationMiddleware = require('flirting-singles-virtual/backend/server/middleware/validation');

// Import Routes
const authRoutes = require('flirting-singles-virtual/backend/server/routes/auth');
const gameRoutes = require('flirting-singles-virtual/backend/server/routes/game');
const chatRoutes = require('flirting-singles-virtual/backend/server/routes/chat');
const userRoutes = require('flirting-singles-virtual/backend/server/routes/user');
const datingRoutes = require('flirting-singles-virtual/backend/server/routes/dating');

// Import Services
const chatService = require('flirting-singles-virtual/client/src/services/chatService');
const bingoService = require('flirting-singles-virtual/client/src/services/bingoService');
const karaokeService = require('flirting-singles-virtual/client/src/serivces/karaokeService');
const datingService = require('flirting-singles-virtual/client/src/services/datingService');

const app = express();
const server = createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limite each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
        defaults: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "wss:"],
    },
},
}));

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Basic middleware
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(limiter);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', authMiddleware, gameRoutes);
app.use('/api/chat', authMiddleware, chatRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/dating', authMiddleware, datingRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected: ${socket.id}');

    // User connection
    socket.on('User_connected', async (data) => {
        try {
            socket.userId = data.user.Id;
            socket.userData = data.userData;

            // Join user to their personal room
            socket.join('user_${data.userId}');

            // Broadcast user online status
            socket.broadcast.emit('user_online', {
                userId: data.userId,
                userData: data.userData
            });

            console.log('User ${data.userData.displayName} connected');
        } catch (error) {
            console.error('User connection error:', error);
        }
    });

    // Chat functionality
    socket.on('join_room', async (roomId) => {
        try {
            socket.join(roomId);
            socket.currentRoom = roomId;

            // Send room history
            const history = await chatService.getRoomHistory(roomId);
            socket.emit('room_history', history);

            // Update online users in room
            const roomUsers = await chatService.getRoomUsers(roomId);
            io.to(roomId).emit('online_users', roomUsers);
        } catch (error) {
            console.error('Join room error:', error);
        }
    });

    socket.on('leave_room', async (roomId) => {
        try {
            socket.leave(roomId);
            if (socket.currentRoom === roomId) {
                socket.currentRoom = null;
            }

            // Update online users in room
            const roomUsers = await chatService.getRoomUsers(roomId) {
                io.to(roomId).emit('online_users', roomUsers);
            } catch (error) {
                console.error('Leave room error:', error);
            }
        });

        socket.on('send_message', async (messageData) => {
            try {
                const savedMessage = await chatService.saveMessage(messageData);
                io.to(messageData.room).emit('receive_message', saveMessage);
            } catch (error) {
                console.error('Send message error:', error);
            }
        });

        socket.on('start_typing', (data) => {
            socket.to('data.room').emit('user_typing', data);
        });

        socket.on('stop_typing', (data) => {
            socket.to(data.room).emit('user_stopped_typing', data);
        });

        // Bingo game functionality
        socket.on('join_bingo', async (data) => {
            try {
                await bingoService.joinGame(socket, data);
            } catch (error) {
                console.error('Join bingo error:', error);
            }
        });

        socket.on('leave_bingo', async (data) => {
            try {
                await bingoService.leaveGame(socket, data);
            } catch (error) {
                console.error('Leave bingo error:', error);
            }
        });

        socket.on('call_bingo', async (data) => {
            try {
                await bingoService.validateBingo(socket, data);
            } catch (error) {
                console.error('Call bingo error:', error);
            }
        });

        // Karaoke functionality
        socket.on('join_karaoke', async (data) => {
            try {
                await karaokeService.joinRoom(socket, data);
            } catch (error) {
                console.error('Join karaoke error:', error);
            }
        });

        socket.on('add_to_karaoke_queue', async (data) => {
            try {
                await karaokeService.addToQueue(socket, data);
            } catch (error) {
                console.error('Add to karaoke queue error:',  error);
            }
        });

        socket.on('skip_karaoke_song', async (data) => {
            try {
                await karaokeService.skipSong(socket, data);
            } catch (error) {
                console.error('Skip karaoke song error:', error);
            }
        });

        socket.on('karakoe_performance_complete', async (data) => {
            try {
                await karaokeService.completePerformance(socket, data);
            } catch (error) {
                console.error('Karaoke performance complete error:', error);
            }
        });

        // Game room functionality
        socket.on('Join_game_room', async (data) => {
            try {
                socket.join('room_${data.roomId}');
                socket.gameRoomId = data.roomId;

                // Add user to room participants
                const roomData = await gameService.addUserToRoom(data.roomId, socket.userId);
                io.to(data.roomId).emit('room_participants', roomData.participants);
            } catch (error) {
                console.error('Join game room error:', error);
            }
        });

        socket.on('leave_game_room', async (data) => {
            try {
                socket.leave('room_${data.roomId}');
                socket.gameRoomId = null;

                // Remove user from room participants
                const roomData = await  gameService.removeParticipant(data.roomId, data.userId);
                io.to('room_${data.roomId}').emit('room_participants', roomData.participants);
            } catch (error) {
                console.error('Leave game room error:', error);
            }
        });

        socket.on('start_game', async (data) => {
            try {
                const countdown = await gameService.statGameCountdown(data);
                io.to('room_${data.roomId}').emit('game_start_countdown', { countdown: countdown });


                // Start countdown timer
                let timeLeft = coundown;
                const countdownInterval = setInterval(() => {
                    timeLeft--;
                    io.to('room_${data.roomId}').emit('countdown_update', { countdown: timeLeft });

                    if (timeLeft < 0) {
                        clearInterval(countdownInterval);
                        io.to('room_${data.roomId}').emit('game_started', { roomId: data.roomId });
                    }
                }, 1000);
        } catch (error) {
            console.error('Start game error:', error);
        }
        });

        // Dating functionality
        socket.on('join_dinner_session', async (data) => {
            try {
                const sessionData = await datingService.joinDinnerSession(socket, data);
                socket.join('dinner_${data.sessionId}');

                io.to('dinner_${data.sessionId}').emit('dinner_session_update', sessionData);
            } catch (error) {
                console.error('Join dinner session error:', error);
            }
        });

        socket.on('select_restauant', async (data) => {
            io.to('dinner_${data.sessionId}').emit('restaurant_selected', {
                restaurant: data.restaurant,
                sessionId: data.sessionId,
            })
            } catch (error) {
                console.error('Selected restaurant error:', error);
            }
        });

        socket.on('order_meal', async (data) => {
            try {
                const orderData = await datingService.orderMeal(socket, data);
                io.to('dinner_${data.sessionId}').emit('meal_ordered', orderData);
            } catch (error) {
                console.error('Order meal error:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected: ${socket.id}');
            // Handle user disconnection logic
            if (socket.userId) {
                socket.broadcast.emit('user_offline', { userId: socket.userId });
                // Optionally, remove user from all rooms they were in
                socket.leaveAll();
            }
        });

        // WebRTC signaling for video calls
        socket.on('offer', (data) => {
            socket.to('dinner_${data.sessionId}').emit('offer', data);
        });

        socket.on('ice-candidate', (data) => {
            socket.to('dinner_${data.sessionId}').emit('ice-candidate', data);
        });

        // Handle disconnection
        socket.on('disconnect', async () => {
            try {
                console.log('User disconnected: ${socket.id}');

                // Leave all rooms
                if (socket.currentRoom) {
                    const roomUsers = await chatService.getRoomUsers(socket.currentRoom);
                    io.to(socket.currentRoom).emit('online_users', roomUsers);
                }

                // Leave game room if applicable
                if (socket.gameRoomId) {
                    const roomData = await gameService.removeParticipant(socket.gameRoomId, socket.userId);
                    io.to('room_${socket.gameRoomId}').emit('room_participants', roomData.participants);
                }

                // Broadcase user offline status
                if (socket.userId) {
                    socket.broadcast.emit('user_offline', { userId: socket.userId});
                }
            } catch (error) {
                console.error('Disconnect error:', error);
            }
        });

        // Error handling middleware
        app.use((err, req, res, next) => {
            console.error(err.stack);

            if (err.name === 'ValidationError') {
                return res.status(400).json({
                    error: 'Validation Error',
                    details: err.message
                });
            }

            if (err.name === 'Unauthorized Error') {
                return status(401).json({
                    error: 'Unauthorized', 
                    message: 'Invalid token'
                });
            }

            res.status(500).json({
                error: 'Internal Server Error', 
                message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message,
            })
        });

        // 404 handler
        app.use('*', (req, res) => {
            res.status(404).json({
                error: 'Not found',
                message: 'The requested resource was not found'
            });
        });

        // Intialize database and Firebase
        async function initializeApp() {
            try {
                await connectDB();
                await initializeFirebase();
                console.log('Database and Firebase initialized successfully');
            } catch (error) {
                console.error('Failed to initialize app:', error);
                process.evit(1);
            }
        }

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received. Shutting down gracefully...');
            server.close(() => {
                console.log('HTTP server closed');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            console.log('SIGINT received. Shutting down gracefully...');
            server.close(() => {
                console.log('Process terminated');
            });
        });

        module.exports = { app, server, io, initializeApp };