import { Request, Response } from "express";
import { User } from "../models";
import bcrypt from "bcrypt";

// Inscription d'un nouvel utilisateur
export const register = async (req: Request, res: Response) => {
  try {
    const { name, mail, password } = req.body;

    const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordVeryStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strictEmailRegex.test(mail.trim())) {
      return res.status(400).json({
        error: "Format du mail invalide",
        message: "Format du mail invalide",
      });
    }

    if (!passwordVeryStrong.test(password)) {
      return res.status(400).json({
        error: "Format du not de passe invalide",
        message: "Format du mot de passe invalide, veuillez entrer un mot de passe avec au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial",
      });
    }

    const existingUser = await User.findByMail(mail);
    if (existingUser) {
      return res.status(409).json({
        error: "Email déjà utilisé",
        message: "Un compte existe déjà avec cet email",
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
      message: "Inscription réussie",
      user: user.toJSON(),
      token,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erreur register:", error);
      res.status(500).json({
        error: "Erreur lors de l'inscription",
        message: error.message,
      });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { mail, password } = req.body;

    if (!mail || !password) {
      return res.status(400).json({
        error: "Mail et mot de passe requis",
        message: "Mail et mot de passe requis",
      });
    }

    const user = await User.findByCredentials(mail, password);
    if (!user) {
      return res.status(401).json({
        error: "Identifiant ou mot de passe incorrect",
        message: "Identifiant ou mot de passe incorrect",
      });
    }

    const token = user.generateAuthToken();

    res.status(200).json({
      message: "Connexion réussie",
      user: user.toJSON(),
      token,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erreur login:", error);
      res.status(500).json({
        error: "Erreur lors de la connexion",
        message: error.message,
      });
    }
  }
};
