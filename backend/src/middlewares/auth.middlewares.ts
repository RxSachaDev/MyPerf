import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { error } from "node:console";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: User; 
    }
  }
}

/**
 * Middleware d'authentification JWT
 * Vérifie le token et attache l'utilisateur à req.user
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			res.status(401).json({
				error : 'Token manquant',
				message : 'Authentification requise. Veuillez fournir un token.'
			})
			return;
		}

		// 2. Extraire le token (format: "Bearer TOKEN")
    const parts = authHeader.split(' ');

		if (parts.length !== 2 || parts[0] !== 'Bearer') {
			res.status(401).json({ 
        error: 'Format de token invalide',
        message: 'Le format doit être: Authorization: Bearer <token>' 
      });
      return;
		}

		const token = parts[1];
		
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET!
		) as { userId: string, email: string};

		// Vérifier que l'utilisateur existe toujours
    const user = await User.findByPk(decoded.userId);

		if (!user) {
      res.status(401).json({ 
        error: 'Utilisateur introuvable',
        message: 'Ce compte n\'existe plus' 
      });
      return;
    }

		// Attacher l'utilisateur à la requête
    req.userId = decoded.userId;
    req.user = user;

    next();

	} catch (error) {
		// Gestion des erreurs JWT spécifiques
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        error: 'Token invalide',
        message: 'Le token est corrompu ou modifié' 
      });
      return;
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        error: 'Token expiré',
        message: 'Votre session a expiré. Veuillez vous reconnecter.' 
      });
      return;
    }
    
    // Erreur inattendue
    console.error('Erreur auth middleware:', error);
    res.status(500).json({ 
      error: 'Erreur serveur',
      message: 'Erreur lors de la vérification du token' 
    });
  }
	
}
