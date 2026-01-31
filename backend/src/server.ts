import app from './app';
import sequelize, { testConnection } from './config/database';

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    // Tester la connexion à la DB
    await testConnection();

    // Synchroniser la DB seulement en dev
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized');
    }

    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Unable to start the server:', error.message);
    } else {
      console.error('Unable to start the server:', error);
    }
    process.exit(1);
  }
};

startServer();
