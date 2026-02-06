import express from 'express';
import { createPerformance, getPerformance } from '../controllers/performance.controller';
const performanceRoutes = express.Router();

performanceRoutes.post('/', createPerformance);
performanceRoutes.get('/', getPerformance);

export default performanceRoutes;