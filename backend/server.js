require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, testConnection } = require('./config/database');


const app = express();
const userRoutes = require('./routes/userRoutes');
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de test
app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

app.use(userRoutes)

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