import { Request, Response } from "express";
import { Serie, Performance } from "../models";

export const createSerie = async (req: Request, res: Response) => {
  try {
    const { repetitions, weight, unit, performanceId } = req.body;

    if (!repetitions || !weight || !unit || !performanceId) {
      return res.status(400).json({
        error: "Repetitions, poid, unité et performanceId requis",
        message: "Repetitions, poid, unité et performanceId requis",
      });
    }

    const existingPerformance = await Performance.findById(performanceId);

    if (!existingPerformance) {
      return res.status(404).json({ message: "Exercice non trouvé" });
    }

    const serie = await Serie.create({
      repetitions,
      weight,
      unit,
      performanceId
    });

    return res.status(201).json({
      message: "Performance créé avec succès",
      serie,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur",
      error,
    });
  }
};