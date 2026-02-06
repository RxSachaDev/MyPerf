import { Request, Response } from "express";
import { Performance, Exercise, User } from "../models";

export const createPerformance = async (req: Request, res: Response) => {
  try {
    const { date, notes, userId, exerciseId } = req.body;

    if (!date || !userId || !exerciseId) {
      return res.status(400).json({
        error: "Date, userId et exerciseId requis",
        message: "Date, userId et exerciseId requis",
      });
    }

		const existingExercise = await Exercise.findById(exerciseId);
		const existingUser = await User.findById(userId);

		if (!existingExercise) {
			res.status(404).json({ message: "Exercice non trouvé" });
		}

		if (!existingUser) {
			res.status(404).json({ message: "Utilisateur non trouvé" });
		}

    const performance = await Performance.create({
      date,
      notes,
      userId,
      exerciseId,
    });

    return res.status(201).json({
      message: "Performance créé avec succès",
      performance,
    });
  } catch (error) {
		return res.status(500).json({
      message: "Erreur serveur",
      error,
    });
	}
};
