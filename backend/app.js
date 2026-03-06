const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const sequelize = require('./config/database');

// Load env vars
dotenv.config();

// Init express
const app = express();

// Middleware
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:4173",
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const User = require('./models/User');
const Resource = require('./models/Resource');
const Like = require('./models/Like');
const Save = require('./models/Save');
const Rating = require('./models/Rating');

// Associations
// (User and Resource associations are handled in Resource.js)

User.hasMany(Like, { foreignKey: 'userId', as: 'likes', onDelete: 'CASCADE' });
Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Resource.hasMany(Like, { foreignKey: 'resourceId', as: 'likes', onDelete: 'CASCADE' });
Like.belongsTo(Resource, { foreignKey: 'resourceId', as: 'resource' });

User.hasMany(Save, { foreignKey: 'userId', as: 'saves', onDelete: 'CASCADE' });
Save.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Resource.hasMany(Save, { foreignKey: 'resourceId', as: 'saves', onDelete: 'CASCADE' });
Save.belongsTo(Resource, { foreignKey: 'resourceId', as: 'resource' });

User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings', onDelete: 'CASCADE' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Resource.hasMany(Rating, { foreignKey: 'resourceId', as: 'ratings', onDelete: 'CASCADE' });
Rating.belongsTo(Resource, { foreignKey: 'resourceId', as: 'resource' });

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const interactionRoutes = require('./routes/interactionRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/interactions', interactionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
});

module.exports = app;
