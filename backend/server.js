require('dotenv').config();
const { sequelize, testConnection } = require('./config/database');
const app = require('./app')

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await testConnection();

        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('Database synchronized');
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start the server:', error);
        process.exit(1);
    }
};

startServer();