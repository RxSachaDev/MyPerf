import { Request, Response } from "express";
import { Exercise } from "../models";

export const getExercise = async (req: Request, res: Response) => {
  const { id, name, category, muscles } = req.body;

  if (id) {
    const exercise = await Exercise.findById(id as string);
    return exercise
      ? res.status(200).json({
          message: `Exercice ${exercise.name} récupéré`,
          exercise: exercise.toJSON(),
        })
      : res.status(404).json({
          message: "Exercice non trouvé",
          error: "Exercice non trouvé",
        });
  }
  if (name) {
    const exercise = await Exercise.findByName(name as string);
    return exercise
      ? res.status(200).json({
          message: `Exercice ${exercise.name} récupéré`,
          exercise: exercise.toJSON(),
        })
      : res.status(404).json({
          message: "Exercice non trouvé",
          error: "Exercice non trouvé",
        });
  }
  if (category && muscles) {
    const exercises = await Exercise.findByCategoryAndMuscles(
      category as string,
      muscles as string
    );

    if (exercises.length === 0) {
      return res.status(200).json({
        message: "Aucun exercice trouvé",
        exercises: [],
      });
    }

    return res.status(200).json({
      message: "Exercices récupérés",
      exercises,
    });
  }
  if (muscles) {
    const exercises = await Exercise.findByMuscles(
      muscles as string
    );

    if (exercises.length === 0) {
      return res.status(200).json({
        message: "Aucun exercice trouvé",
        exercises: [],
      });
    }

    return res.status(200).json({
      message: "Exercices récupérés",
      exercises,
    });
  }
  if (category) {
    const exercises = await Exercise.findByCategory(
      category as string
    );

    if (exercises.length === 0) {
      return res.status(200).json({
        message: "Aucun exercice trouvé",
        exercises: [],
      });
    }

    return res.status(200).json({
      message: "Exercices récupérés",
      exercises,
    });
  }
};
