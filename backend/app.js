const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes')
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
})

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de test
app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

app.use('/api/auth', userRoutes);

// Middleware 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Middleware d'erreur global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur' });
});

module.exports = app;