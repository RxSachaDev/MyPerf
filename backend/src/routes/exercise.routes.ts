import express from 'express';
import { getExercise, createExercise, editExercise, deleteExercise } from '../controllers/exercise.controller';
const exerciceRoute = express.Router();

// Routes publiques
exerciceRoute.get('/', getExercise)
exerciceRoute.post('/', createExercise)
exerciceRoute.put('/:id', editExercise)
exerciceRoute.delete('/:id', deleteExercise)

export default exerciceRoute;