const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration (allow all origins in dev)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser Middleware
app.use(express.json());

// MongoDB Atlas Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://kamalakantabera986_db_user:DDnzMXMcj8tenA00@cluster0.smtufuj.mongodb.net/visitor-management?retryWrites=true&w=majority&appName=Cluster0';


mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Atlas Connected Successfully!');
        console.log(`📡 Database: ${mongoose.connection.name}`);
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
    });

// Mount Routes
const authRoutes = require('./routes/authRoutes');
const visitorRoutes = require('./routes/visitorRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/visitors', visitorRoutes);

// Serve built frontend assets in production if dist exists
const path = require('path');
const fs = require('fs');
const frontendDist = path.join(__dirname, '../frontend/dist');

// API Status & Health Check endpoints
app.get('/api', (req, res) => {
    res.json({
        message: '🏢 Employee Visitor Management System API is running smoothly.',
        version: '1.0.0',
        databaseStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting/Disconnected',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'UP',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        uptime: process.uptime()
    });
});

if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        res.sendFile(path.join(frontendDist, 'index.html'));
    });
} else {
    // If frontend dist not yet built, show API status at root
    app.get('/', (req, res) => {
        res.json({
            message: '🏢 Employee Visitor Management System API is running smoothly.',
            version: '1.0.0',
            databaseStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting/Disconnected',
            timestamp: new Date().toISOString()
        });
    });
}

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start Express Server
app.listen(PORT, () => {
    console.log(`🚀 Server is listening on http://localhost:${PORT}`);
});
