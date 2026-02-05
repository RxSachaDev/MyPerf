import express from 'express';
import { register, login } from '../controllers/user.controller';
const userRoutes = express.Router();

// Routes publiques
userRoutes.post('/register', register);
userRoutes.post('/login', login);

// Routes pour les utilisateurs

export default userRoutes;
