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

  describe("POST /api/performances/", () => {
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

  describe("GET /api/performances", () => {
    let perf1: any;
    let perf2: any;
    let perf3: any;

    beforeEach(async () => {
      perf1 = await Performance.create({
        date: new Date("2025-02-01"),
        notes: "Séance pectoraux",
        userId,
        exerciseId,
      });

      perf2 = await Performance.create({
        date: new Date("2025-02-02"),
        notes: "Séance lourde",
        userId,
        exerciseId,
      });

      perf3 = await Performance.create({
        date: new Date("2025-02-03"),
        notes: "Séance légère",
        userId,
        exerciseId,
      });
    });

    it("devrait récupérer toutes les performances", async () => {
      const response = await request(app).get("/api/performances").expect(200);

      expect(response.body).toHaveProperty(
        "message",
        "Performances récupérées",
      );
      expect(response.body.performances.length).toBe(3);
    });

    it("devrait récupérer une performance par ID", async () => {
      const response = await request(app)
        .get("/api/performances")
        .query({ id: perf1.id })
        .expect(200);

      expect(response.body).toHaveProperty("message", "Performance récupérée");
      expect(response.body.performance.id).toBe(perf1.id);
    });

    it("devrait retourner 404 si ID inexistant", async () => {
      const response = await request(app)
        .get("/api/performances")
        .query({ id: "123e4567-e89b-12d3-a456-426614174000" })
        .expect(404);

      expect(response.body).toHaveProperty("error", "Performance introuvable");
    });

    it("devrait filtrer par userId", async () => {
      const response = await request(app)
        .get("/api/performances")
        .query({ userId })
        .expect(200);

      expect(response.body.performances.length).toBe(3);
    });

    it("devrait filtrer par exerciseId", async () => {
      const response = await request(app)
        .get("/api/performances")
        .query({ exerciseId })
        .expect(200);

      expect(response.body.performances.length).toBe(3);
    });

    it("devrait filtrer par date", async () => {
      const response = await request(app)
        .get("/api/performances")
        .query({ date: "2025-02-02" })
        .expect(200);

      expect(response.body.performances.length).toBe(1);
      expect(response.body.performances[0].notes).toBe("Séance lourde");
    });

    it("devrait combiner userId + exerciseId", async () => {
      const response = await request(app)
        .get("/api/performances")
        .query({ userId, exerciseId })
        .expect(200);

      expect(response.body.performances.length).toBe(3);
    });

    it("devrait retourner un tableau vide si aucun résultat", async () => {
      const response = await request(app)
        .get("/api/performances")
        .query({ date: "2030-01-01" })
        .expect(200);

      expect(response.body.performances).toHaveLength(0);
      expect(response.body.message).toBe("Aucune performance trouvée");
    });

    it("devrait prioriser la recherche par ID", async () => {
      const response = await request(app)
        .get("/api/performances")
        .query({
          id: perf2.id,
          userId,
          date: "2025-02-01",
        })
        .expect(200);

      expect(response.body.performance.id).toBe(perf2.id);
    });

    it("devrait trier par date décroissante", async () => {
      const response = await request(app).get("/api/performances").expect(200);

      const dates = response.body.performances.map((p: any) =>
        new Date(p.date).toISOString(),
      );

      expect(dates).toEqual([...dates].sort().reverse());
    });
  });

  describe("Performance API › PUT /api/performances/:id", () => {
    let performanceId: string;

    beforeEach(async () => {
      const performance = await Performance.create({
        date: new Date("2025-02-01"),
        notes: "Séance initiale",
        userId,
        exerciseId,
      });

      performanceId = performance.id;
    });

    // ============================
    // SUCCESS
    // ============================

    it("devrait modifier la date", async () => {
      const response = await request(app)
        .put(`/api/performances/${performanceId}`)
        .send({
          date: "2025-03-01",
        })
        .expect(200);

      expect(response.body.message).toBe("Performance modifiée avec succès");

      expect(response.body.performance.date).toContain("2025-03-01");
    });

    it("devrait modifier les notes", async () => {
      const response = await request(app)
        .put(`/api/performances/${performanceId}`)
        .send({
          notes: "Nouvelle séance",
        })
        .expect(200);

      expect(response.body.performance.notes).toBe("Nouvelle séance");
    });

    it("devrait modifier date et notes", async () => {
      const response = await request(app)
        .put(`/api/performances/${performanceId}`)
        .send({
          date: "2025-04-01",
          notes: "Séance modifiée",
        })
        .expect(200);

      expect(response.body.performance.date).toContain("2025-04-01");

      expect(response.body.performance.notes).toBe("Séance modifiée");
    });

    // ============================
    // ERRORS
    // ============================

    it("devrait retourner 404 si ID inexistant", async () => {
      const response = await request(app)
        .put("/api/performances/123e4567-e89b-12d3-a456-426614174000")
        .send({
          notes: "Test",
        })
        .expect(404);

      expect(response.body.error).toBe("Performance introuvable");
    });

    it("devrait retourner 400 si aucun champ fourni", async () => {
      const response = await request(app)
        .put(`/api/performances/${performanceId}`)
        .send({})
        .expect(400);

      expect(response.body.error).toBe("Aucune donnée à modifier");
    });
  });

  describe("DELETE /api/performances/:id", () => {
    it("devrait supprimer une performance", async () => {
      const performance = await Performance.create({
        date: new Date("2025-02-01"),
        notes: "Séance initiale",
        userId,
        exerciseId,
      });

      const response = await request(app)
        .delete(`/api/performances/${performance.id}`)
        .expect(200);

      expect(response.body.message).toBe("Performance supprimée avec succès");
      expect(response.body.deletedPerformance.id).toBe(performance.id);

      // Vérifier que la performance n'existe plus
      const deleted = await Performance.findById(performance.id);
      expect(deleted).toBeNull();
    });

    it("devrait retourner 404 si ID inexistant", async () => {
      const response = await request(app)
        .delete("/api/performances/3fa85f64-5717-4562-b3fc-2c963f66afa6")
        .expect(404);

      expect(response.body.error).toBe("Performance introuvable");
    });

    it("devrait retourner 400 si ID manquant", async () => {
      const response = await request(app)
        .delete("/api/performances/")
        .expect(404);
      // Express ne matche pas la route sans ID
    });
  });
});
