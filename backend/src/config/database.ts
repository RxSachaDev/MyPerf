import { Sequelize } from 'sequelize';
import path from 'path';

// Charger le bon fichier .env selon l'environnement
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

require('dotenv').config({
  path: path.resolve(process.cwd(), envFile)
});

console.log(`📁 Utilisation de l'environnement: ${envFile}`);
console.log(`🗄️  Base de données: ${process.env.DB_NAME}`);

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à PostgreSQL réussie');
  } catch (error) {
    console.error('Erreur de connexion à PostgreSQL:', error);
  }
};

export default sequelize;