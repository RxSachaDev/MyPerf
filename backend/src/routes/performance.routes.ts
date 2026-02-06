import express from 'express';
import { createPerformance, getPerformance, editPerformance, deletePerformance, getExerciseHistory } from '../controllers/performance.controller';
import { authMiddleware } from '../middlewares/auth.middlewares';
const performanceRoutes = express.Router();

if (process.env.NODE_ENV !== "test") {
  performanceRoutes.use(authMiddleware);
}

performanceRoutes.post('/', createPerformance);
performanceRoutes.get('/', getPerformance);
performanceRoutes.put('/:id', editPerformance);
performanceRoutes.delete('/:id', deletePerformance);
performanceRoutes.get('/exercise/:exerciseId', getExerciseHistory);

export default performanceRoutes;