// tests/performance.test.ts
process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../app";
import { Performance, User, Exercise } from "../models";

require("./setup");

describe("Performance API", () => {
  // =============================================
  // POST /api/performances/ - Créer une performance
  // =============================================

  describe("POST /api/performances/", () => {
    let userId: string;
    let exerciseId: string;

    beforeEach(async () => {
      // Créer un utilisateur et un exercice nécessaires
      const user = await User.create({
        name: "Test",
        mail: "test@test.com",
        password: "password123",
      });

      const exercise = await Exercise.create({
        name: "Développé couché",
        category: "Haut du corps",
        muscles: "Pectoraux",
      });

      userId = user.id;
      exerciseId = exercise.id;
    });

    it("devrait créer une performance avec succès", async () => {
      const performanceData = {
        date: "2025-02-01",
        notes: "Bonne séance",
        userId,
        exerciseId,
      };

      const response = await request(app)
        .post("/api/performances/")
        .send(performanceData)
        .expect(201);

      expect(response.body).toHaveProperty(
        "message",
        "Performance créé avec succès",
      );

      expect(response.body.performance).toMatchObject({
        notes: "Bonne séance",
        userId,
        exerciseId,
      });

      expect(response.body.performance.date).toContain("2025-02-01");

      expect(response.body.performance).toHaveProperty("id");
      expect(response.body.performance).toHaveProperty("createdAt");
      expect(response.body.performance).toHaveProperty("updatedAt");
    });

    it("devrait créer plusieurs performances pour un même exercice", async () => {
      const performances = [
        { date: "2025-02-01", notes: "Séance 1" },
        { date: "2025-02-05", notes: "Séance 2" },
        { date: "2025-02-10", notes: "Séance 3" },
      ];

      for (const perf of performances) {
        const response = await request(app)
          .post("/api/performances/")
          .send({
            ...perf,
            userId,
            exerciseId,
          })
          .expect(201);

        expect(response.body.performance.notes).toBe(perf.notes);
      }

      const count = await Performance.count();
      expect(count).toBe(3);
    });

    it("devrait retourner une erreur si la date est manquante", async () => {
      const response = await request(app)
        .post("/api/performances/")
        .send({
          notes: "Test",
          userId,
          exerciseId,
        })
        .expect(400);

      expect(response.body).toHaveProperty(
        "error",
        "Date, userId et exerciseId requis",
      );
    });

    it("devrait retourner une erreur si userId est manquant", async () => {
      const response = await request(app)
        .post("/api/performances/")
        .send({
          date: "2025-02-01",
          exerciseId,
        })
        .expect(400);

      expect(response.body).toHaveProperty(
        "error",
        "Date, userId et exerciseId requis",
      );
    });

    it("devrait retourner une erreur si exerciseId est manquant", async () => {
      const response = await request(app)
        .post("/api/performances/")
        .send({
          date: "2025-02-01",
          userId,
        })
        .expect(400);

      expect(response.body).toHaveProperty(
        "error",
        "Date, userId et exerciseId requis",
      );
    });

    it("devrait retourner une erreur si tous les champs sont manquants", async () => {
      const response = await request(app)
        .post("/api/performances/")
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty(
        "error",
        "Date, userId et exerciseId requis",
      );
    });

    it("devrait accepter des notes longues", async () => {
      const response = await request(app)
        .post("/api/performances/")
        .send({
          date: "2025-02-01",
          notes:
            "Très bonne séance avec charge progressive et bonne technique.",
          userId,
          exerciseId,
        })
        .expect(201);

      expect(response.body.performance.notes).toContain("Très bonne séance");
    });

    it("devrait créer une performance même sans notes", async () => {
      const response = await request(app)
        .post("/api/performances/")
        .send({
          date: "2025-02-01",
          userId,
          exerciseId,
        })
        .expect(201);

      expect(response.body.performance.notes).toBeNull();
    });

    it("devrait persister la performance en base", async () => {
      const response = await request(app)
        .post("/api/performances/")
        .send({
          date: "2025-02-01",
          notes: "Persist test",
          userId,
          exerciseId,
        })
        .expect(201);

      const performanceId = response.body.performance.id;

      const perfInDb = await Performance.findById(performanceId);

      expect(perfInDb).toBeTruthy();
      expect(perfInDb!.notes).toBe("Persist test");
    });

    it("devrait retourner une erreur si userId n'existe pas", async () => {
      const fakeUserId = "123e4567-e89b-12d3-a456-426614174000";

      const response = await request(app)
        .post("/api/performances/")
        .send({
          date: "2025-02-01",
          userId: fakeUserId,
          exerciseId,
        })
        .expect(404); // selon ton implémentation FK

      expect(response.body).toHaveProperty("message", "Utilisateur non trouvé");
    });

    it("devrait retourner une erreur si exerciseId n'existe pas", async () => {
      const fakeExerciseId = "123e4567-e89b-12d3-a456-426614174000";

      const response = await request(app)
        .post("/api/performances/")
        .send({
          date: "2025-02-01",
          userId,
          exerciseId: fakeExerciseId,
        })
        .expect(404);

      expect(response.body).toHaveProperty("message", "Exercice non trouvé");
    });
  });
});
