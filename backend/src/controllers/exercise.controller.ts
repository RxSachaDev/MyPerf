import { Request, Response } from "express";
import { Exercise } from "../models";

export const getExercise = async (req: Request, res: Response) => {
  try {
    const { id, name, category, muscles } = req.query;

    if (id) {
      const exercise = await Exercise.findById(id as string);
      return exercise
        ? res.status(200).json({
            message: "Exercice récupéré",
            exercise,
          })
        : res.status(404).json({ message: "Exercice non trouvé" });
    }

    if (name) {
      const exercise = await Exercise.findByName(name as string);
      return exercise
        ? res.status(200).json({
            message: "Exercice récupéré",
            exercise,
          })
        : res.status(404).json({ message: "Exercice non trouvé" });
    }

    if (category && muscles) {
      const exercises = await Exercise.findByCategoryAndMuscles(
        category as string,
        muscles as string
      );

      return res.status(200).json({
        message:
          exercises.length === 0
            ? "Aucun exercice trouvé"
            : "Exercices récupérés",
        exercises,
      });
    }

    if (muscles) {
      const exercises = await Exercise.findByMuscles(muscles as string);

      return res.status(200).json({
        message:
          exercises.length === 0
            ? "Aucun exercice trouvé"
            : "Exercices récupérés",
        exercises,
      });
    }

    if (category) {
      const exercises = await Exercise.findByCategory(category as string);

      return res.status(200).json({
        message:
          exercises.length === 0
            ? "Aucun exercice trouvé"
            : "Exercices récupérés",
        exercises,
      });
    }

    // 🔹 Aucun filtre → tout
    const exercises = await Exercise.findAll();
    return res.status(200).json({
      message: "Exercices récupérés",
      exercises,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur",
      error,
    });
  }
};


export const createExercise = async (req:Request, res: Response) => {
  try {
    const { name, category, muscles } = req.body;

    if ( !name || !category || !muscles) {
      return res.status(400).json({
          error: "Nom, category et muscle(s) de l'exercice requis",
          message: "Nom, category et muscle(s) de l'exercice requis",
      });
    }

    const existExercise = await Exercise.findByName(name);

    if (existExercise) {
      return res.status(409).json({
          error: "Nom d'exercice déjà utilisé",
          message: "Un exercice existe déjà avec ce nom",
      });
    }

    const exercise = await Exercise.create({
        name,
        category,
        muscles,
    });

    return res.status(201).json({
        message: "Exercice créé avec succès",
        exercise,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur",
      error,
    });
  }
}
