import express from 'express';
import { createPerformance, getPerformance, editPerformance, deletePerformance } from '../controllers/performance.controller';
const performanceRoutes = express.Router();

performanceRoutes.post('/', createPerformance);
performanceRoutes.get('/', getPerformance);
performanceRoutes.put('/:id', editPerformance);
performanceRoutes.delete('/:id', deletePerformance);

export default performanceRoutes;