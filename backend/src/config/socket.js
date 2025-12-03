const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

let io;

const initializeSocket = (server) => {
    io = socketIO(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    // Authentication middleware for socket connections
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            socket.userEmail = decoded.email;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        logger.info(`User connected: ${socket.userId}`);

        // Join project room
        socket.on('join:project', (projectId) => {
            socket.join(`project:${projectId}`);
            socket.to(`project:${projectId}`).emit('user:joined', {
                userId: socket.userId,
                email: socket.userEmail
            });
            logger.info(`User ${socket.userId} joined project ${projectId}`);
        });

        // Leave project room
        socket.on('leave:project', (projectId) => {
            socket.leave(`project:${projectId}`);
            socket.to(`project:${projectId}`).emit('user:left', {
                userId: socket.userId,
                email: socket.userEmail
            });
            logger.info(`User ${socket.userId} left project ${projectId}`);
        });

        // Handle task updates
        socket.on('task:update', (data) => {
            socket.to(`project:${data.projectId}`).emit('task:updated', data);
        });

        // Handle task movement (Kanban)
        socket.on('task:move', (data) => {
            socket.to(`project:${data.projectId}`).emit('task:moved', data);
        });

        // Handle milestone updates
        socket.on('milestone:update', (data) => {
            socket.to(`project:${data.projectId}`).emit('milestone:updated', data);
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            logger.info(`User disconnected: ${socket.userId}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

// Emit events to specific project rooms
const emitToProject = (projectId, event, data) => {
    if (io) {
        io.to(`project:${projectId}`).emit(event, data);
    }
};

module.exports = {
    initializeSocket,
    getIO,
    emitToProject
};
