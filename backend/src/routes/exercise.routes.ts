import express from 'express';
import { getExercise, createExercise } from '../controllers/exercise.controller';
const exerciceRoute = express.Router();

// Routes publiques
exerciceRoute.get('', getExercise)
exerciceRoute.get('/create', createExercise)

export default exerciceRoute;