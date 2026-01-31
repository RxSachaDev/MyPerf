const { sequelize } = require('../config/database')

beforeAll(async () => {
  try {
    console.log('Initialisation des tests...');
    
    // Se connecter à la base de données de test
    await sequelize.authenticate();
    console.log(`Connecté à la base de test: ${process.env.DB_NAME}`);
    
    // DROP toutes les tables puis les recréer (clean slate)
    await sequelize.sync({ force: true });
    console.log('Tables créées dans la base de test');
    
  } catch (error) {
    console.error('Erreur setup base de données:', error);
    throw error;
  }
});

beforeEach(async () => {
  // Vider toutes les tables entre chaque test
  await sequelize.truncate({ cascade: true, restartIdentity: true });
});

afterAll(async () => {
  try {
    // Fermer la connexion
    await sequelize.close();
    console.log('Connexion à la base de test fermée');
  } catch (error) {
    console.error('Erreur fermeture connexion:', error);
  }
});