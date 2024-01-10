const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const config = require('./src/config/config');
const authRoutes = require('./src/Controllers/authRoutes');
const adminRoutes = require('./src/Controllers/adminRoutes');
const locationRoutes = require('./src/Controllers/locationRoutes');
const postRoutes = require('./src/Controllers/postRoutes');

require('dotenv').config();




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

    
    // Use Auth Routes
    app.use('/api', authRoutes);


    app.use('/admin', adminRoutes);

    app.use('/map', locationRoutes);

    app.use('/posts', postRoutes);
   
    db.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });

    db.once('open', () => {
        console.log('Connected to MongoDB');
    });

    // Other route configurations and server setup go here...

    // Automatically find an available port
    const defaultPort = 5000;

    portfinder.getPortPromise({ port: defaultPort })
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
