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
			return res.status(404).json({ message: "Exercice non trouvé" });
		}

		if (!existingUser) {
			return res.status(404).json({ message: "Utilisateur non trouvé" });
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

export const getPerformance = async (req: Request, res: Response) => {
  try {
    const { id, userId, exerciseId, date } = req.query;

		// Recherche par ID prioritaire
    if (id) {
      const performance = await Performance.findById(id as string);

      if (!performance) {
        return res.status(404).json({
          error: "Performance introuvable",
          message: "Aucune performance trouvée avec cet ID"
        });
      }

      return res.status(200).json({
        message: "Performance récupérée",
        performance
      });
    }

		// Filtrage
    const filters: any = {};

    if (userId) filters.userId = userId;
    if (exerciseId) filters.exerciseId = exerciseId;
    if (date) filters.date = new Date(date as string);;

    const performances = await Performance.findAllPerformances(filters);

    if (performances.length === 0) {
      return res.status(200).json({
        message: "Aucune performance trouvée",
        performances: []
      });
    }

    return res.status(200).json({
      message: "Performances récupérées",
      performances
    });

  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur",
      error
    });
  }
};