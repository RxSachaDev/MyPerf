import { Request, Response, NextFunction } from 'express';

// Middleware 404 - Route non trouvée
export const notFoundMiddleware = (req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    message: `La route ${req.method} ${req.url} n'existe pas`,
    availableRoutes: {
      auth: '/api/auth',
      users: '/api/users',
      workouts: '/api/workouts'
    }
  });
};

// Middleware de gestion des erreurs globales
export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Erreur:', err.stack);
  
  res.status(500).json({ 
    error: 'Erreur serveur interne',
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};