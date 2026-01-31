// config/database.js
const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Charger le bon fichier .env selon l'environnement
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

require('dotenv').config({
  path: path.resolve(process.cwd(), envFile)
});

console.log(`📁 Utilisation de l'environnement: ${envFile}`);
console.log(`🗄️  Base de données: ${process.env.DB_NAME}`);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgresql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à PostgreSQL réussie');
  } catch (error) {
    console.error('Erreur de connexion à PostgreSQL:', error);
  }
};

module.exports = { sequelize, testConnection };