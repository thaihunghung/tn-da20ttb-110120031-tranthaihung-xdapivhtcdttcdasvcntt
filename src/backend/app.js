const cookieParser = require('cookie-parser');
const express = require('express');
const passport = require('./authentication/passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const indexRouter = require('./routes/IndexRouter');
const authRoutes = require('./routes/AuthRoutes');
require('dotenv').config();

const app = express();

// Parse middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Security middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Session config
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax'
    }
}));

// Passport config
app.use(passport.initialize());

// CORS config
const allowedOrigins = ['http://localhost:3000'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS not allowed'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept'
    ],
    exposedHeaders: ['Authorization'],
}));


// Request logging middleware
app.use((req, res, next) => {
    if (Object.keys(req.query).length > 0) {
        console.log('[Query Parameters]:', {
            path: req.path,
            method: req.method,
            query: req.query,
            timestamp: new Date().toISOString()
        });
    }
    next();
});

// Static files
app.use(express.static("public"));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Routes
app.use('/', indexRouter);
app.use('/auth', authRoutes);

// Custom error class
class APIError extends Error {
    constructor(status, message, details = {}) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error Details:', {
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
        query: req.query,
        params: req.params,
        body: req.body,
        error: {
            name: err.name,
            message: err.message,
            status: err.status,
            stack: err.stack
        }
    });

    const errorResponse = {
        status: err.status || 500,
        message: err.message || 'Internal Server Error',
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString(),
        requestData: {
            query: req.query,
            params: req.params,
            body: process.env.NODE_ENV === 'development' ? req.body : undefined
        },
        error: {
            type: err.name,
            details: err.details || {},
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }
    };

    if (err instanceof APIError) {
        res.status(err.status).json(errorResponse);
    } else if (err.name === 'ValidationError') {
        errorResponse.status = 400;
        res.status(400).json(errorResponse);
    } else if (err.name === 'UnauthorizedError') {
        errorResponse.status = 401;
        res.status(401).json(errorResponse);
    } else {
        res.status(500).json(errorResponse);
    }
});

// 404 handler
app.use((req, res) => {
    const notFoundResponse = {
        status: 404,
        message: 'Route Not Found',
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString(),
        requestData: {
            query: req.query,
            params: req.params,
            headers: req.headers
        }
    };
    
    console.log('404 Not Found:', notFoundResponse);
    res.status(404).json(notFoundResponse);
});

// Graceful shutdown
const gracefulShutdown = () => {
    console.log('Initiating graceful shutdown...');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
};

// Start server
const port = process.env.PORT || 1509;
const server = app.listen(port, 'localhost', () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Started at: ${new Date().toISOString()}`);
});

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', {
        error: err,
        stack: err.stack,
        timestamp: new Date().toISOString()
    });
    gracefulShutdown();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', {
        reason: reason,
        promise: promise,
        timestamp: new Date().toISOString()
    });
});

module.exports = { app, APIError };