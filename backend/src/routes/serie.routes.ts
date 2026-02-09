import express from 'express';
import { createSerie } from '../controllers/serie.controller';
const serieRoutes = express.Router();

serieRoutes.post('/', createSerie);

export default serieRoutes;