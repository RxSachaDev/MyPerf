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

export const editExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;  
    const { name, category, muscles } = req.body;  

    // Vérifier que l'ID est fourni
    if (!id) {
      return res.status(400).json({
        error: "ID de l'exercice requis",
        message: "L'ID de l'exercice est requis",
      });
    }

    // Vérifier que l'exercice existe
    const existingExercise = await Exercise.findById(id as string);

    if (!existingExercise) {
      return res.status(404).json({
        error: "Exercice introuvable",
        message: "Aucun exercice trouvé avec cet ID",
      });
    }

    // Vérifier qu'au moins un champ est fourni pour la mise à jour
    if (!name && !category && !muscles) {
      return res.status(400).json({
        error: "Aucune donnée à modifier",
        message: "Veuillez fournir au moins un champ à modifier (name, category, ou muscles)",
      });
    }

    // Si le nom change, vérifier qu'il n'existe pas déjà
    if (name && name !== existingExercise.name) {
      const duplicateExercise = await Exercise.findByName(name);
      
      if (duplicateExercise && duplicateExercise.id !== id) {
        return res.status(409).json({
          error: "Nom d'exercice déjà utilisé",
          message: "Un autre exercice existe déjà avec ce nom",
        });
      }
    }

    // Mettre à jour l'exercice
    await existingExercise.update({
      name: name || existingExercise.name,
      category: category || existingExercise.category,
      muscles: muscles || existingExercise.muscles,
    });

    return res.status(200).json({
      message: "Exercice modifié avec succès",
      exercise: existingExercise,
    });

  } catch (error) {
    console.error('Erreur editExercise:', error);
    return res.status(500).json({
      error: "Erreur serveur",
      message: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};

export const deleteExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Vérifier que l'ID est fourni
    if (!id) {
      return res.status(400).json({
        error: "ID de l'exercice requis",
        message: "L'ID de l'exercice est requis",
      });
    }

    // Vérifier que l'exercice existe
    const exercise = await Exercise.findById(id as string);

    if (!exercise) {
      return res.status(404).json({
        error: "Exercice introuvable",
        message: "Aucun exercice trouvé avec cet ID",
      });
    }

    // Supprimer l'exercice
    await exercise.destroy();

    return res.status(200).json({
      message: "Exercice supprimé avec succès",
      deletedExercise: {
        id: exercise.id,
        name: exercise.name,
      },
    });

  } catch (error) {
    console.error('Erreur deleteExercise:', error);
    return res.status(500).json({
      error: "Erreur serveur",
      message: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};