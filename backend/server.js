const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 8080;

// Sync database and start server
sequelize.sync({ alter: true }) // Using alter to safely update schema if needed
    .then(() => {
        console.log('Database synchronized.');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to sync database:', error);
    });
