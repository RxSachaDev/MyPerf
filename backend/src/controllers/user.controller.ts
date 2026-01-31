import { Request, Response} from 'express';
import { User } from '../models';
import bcrypt from 'bcrypt';

// Inscription d'un nouvel utilisateur
export const register = async (req: Request, res: Response) => {
    try {
        const {name, mail, password} = req.body;

        const existingUser = await User.findByMail(mail);
        if (existingUser) {
            return res.status(409).json({ 
                error: 'Email déjà utilisé',
                message: 'Un compte existe déjà avec cet email' 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            mail,
            password: hashedPassword,
        });

        const token = user.generateAuthToken();

        res.status(201).json({
            message: 'Inscription réussie',
            user: user.toJSON(), token
        })

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Erreur register:', error);
            res.status(500).json({ 
                error: 'Erreur lors de l\'inscription',
                message: error.message 
            });
        }
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { mail, password } = req.body;
    } catch( error: unknown ) {
        
    }
}