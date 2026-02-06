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
          message: "Aucune performance trouvée avec cet ID",
        });
      }

      return res.status(200).json({
        message: "Performance récupérée",
        performance,
      });
    }

    // Filtrage
    const filters: any = {};

    if (userId) filters.userId = userId;
    if (exerciseId) filters.exerciseId = exerciseId;
    if (date) filters.date = new Date(date as string);

    const performances = await Performance.findAllPerformances(filters);

    if (performances.length === 0) {
      return res.status(200).json({
        message: "Aucune performance trouvée",
        performances: [],
      });
    }

    return res.status(200).json({
      message: "Performances récupérées",
      performances,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur",
      error,
    });
  }
};

export const editPerformance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, notes } = req.body;

    // Vérifier que l'ID est fourni
    if (!id) {
      return res.status(400).json({
        error: "ID de l'exercice requis",
        message: "L'ID de l'exercice est requis",
      });
    }

    // Vérifier que l'exercice existe
    const existingPerformance = await Performance.findById(id as string);

    if (!existingPerformance) {
      return res.status(404).json({
        error: "Performance introuvable",
        message: "Aucun exercice trouvé avec cet ID",
      });
    }

    // Vérifier qu'au moins un champ est fourni pour la mise à jour
    if (!date && !notes) {
      return res.status(400).json({
        error: "Aucune donnée à modifier",
        message:
          "Veuillez fournir au moins un champ à modifier (name, category, ou muscles)",
      });
    }

    // Mettre à jour l'exercice
    await existingPerformance.update({
      date: date || existingPerformance.date,
      notes: notes || existingPerformance.notes,
    });

    return res.status(200).json({
      message: "Performance modifiée avec succès",
      performance: existingPerformance,
    });
  } catch (error) {
    console.error("Erreur editExercise:", error);
    return res.status(500).json({
      error: "Erreur serveur",
      message: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};

export const deletePerformance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier que l'ID est fourni
    if (!id) {
      return res.status(400).json({
        error: "ID de la performance requis",
        message: "L'ID de la performance est requis",
      });
    }

    // Vérifier que l'exercice existe
    const performance = await Performance.findById(id as string);

    if (!performance) {
      return res.status(404).json({
        error: "Performance introuvable",
        message: "Aucune performance trouvée avec cet ID",
      });
    }

    // Supprimer l'exercice
    await performance.destroy();

    return res.status(200).json({
      message: "Performance supprimée avec succès",
      deletedPerformance: {
        id: performance.id,
      },
    });
  } catch (error) {
    console.error("Erreur deleteExercise:", error);
    return res.status(500).json({
      error: "Erreur serveur",
      message: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};

export const getExerciseHistory = async (req: Request, res: Response) => {
  try {
    const { exerciseId } = req.params;
    const userId = req.userId!; // Vient de authMiddleware

    // Vérifier que l'exercice existe
    const exercise = await Exercise.findById(exerciseId as string);

    if (!exercise) {
      return res.status(404).json({
        error: "Exercice introuvable",
        message: "Aucun exercice trouvé avec cet ID",
      });
    }

    // Récupérer toutes les performances pour cet exercice
    const performances = await Performance.findByExercise(
      exerciseId as string,
      userId || undefined,
    );

    return res.status(200).json({
      message: "Historique récupéré avec succès",
      exercise: {
        id: exercise.id,
        name: exercise.name,
        category: exercise.category,
        muscles: exercise.muscles,
      },
      performances,
      total: performances.length,
    });
  } catch (error) {
    console.error("Erreur getExerciseHistory:", error);
    return res.status(500).json({
      error: "Erreur serveur",
      message: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};
