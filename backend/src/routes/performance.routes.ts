import express from 'express';
import { createPerformance } from '../controllers/performance.controller';
const performanceRoutes = express.Router();

performanceRoutes.post('/', createPerformance);

export default performanceRoutes;