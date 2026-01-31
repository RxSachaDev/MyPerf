import express from 'express';
import { register } from '../controllers/user.controller';
const userRoutes = express.Router();

// Routes publiques
userRoutes.post('/register', register)

// Routes pour les utilisateurs

export default userRoutes;