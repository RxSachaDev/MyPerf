import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import exerciceRoute from './routes/exercise.routes';
import { notFoundMiddleware, errorMiddleware } from './middlewares/error.middleware';
import { loggerMiddleware } from './middlewares/logger.middleware';


const app = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger (optionnel, pour le développement)
if (process.env.NODE_ENV === 'development') {
  app.use(loggerMiddleware);
}

// Route de test
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'API is running' });
});

app.use('/api/auth', userRoutes);
app.use('api/exercises', exerciceRoute);

// 404 - Route non trouvée
app.use(notFoundMiddleware);

// Gestionnaire d'erreur global
app.use(errorMiddleware);

export default app;