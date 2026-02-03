import express from 'express';
import { getExercise } from '../controllers/exercise.controller';
const exerciceRoute = express.Router();

// Routes publiques
exerciceRoute.get('', getExercise)

export default exerciceRoute;