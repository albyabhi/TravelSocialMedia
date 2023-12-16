const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const config = require('./src/config/config');
const { authenticateToken } = require('./src/middleware/authMiddleware');
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/authRoutes'); // Import your adminRoutes module
const portfinder = require('portfinder');

process.on('SIGINT', () => {
    console.log('Server is shutting down...');
    // Perform any necessary cleanup before exiting
    process.exit();
});

const startServer = async () => {
    const app = express();

    // Middleware and Configurations
    app.use(express.json());
    app.use(cors());
    app.use('/uploads', express.static('public/uploads'));

    // Connect to MongoDB
    await mongoose.connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = mongoose.connection;

    db.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });

    db.once('open', () => {
        console.log('Connected to MongoDB');
    });

    // Use Auth Routes
    app.use('/api', authRoutes);

    // Use Admin Routes
    app.use('/admin', adminRoutes); // Assuming your admin routes start with '/admin'

    // Automatically find an available port
    portfinder.getPortPromise({ port: config.port })
        .then((port) => {
            // Start the server
            app.listen(port, () => {
                console.log(`Server is running on http://localhost:${port}`);
            });
        })
        .catch((err) => {
            console.error('Error finding an available port:', err);
        });
};

startServer();
