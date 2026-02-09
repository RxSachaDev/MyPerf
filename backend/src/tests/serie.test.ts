import request from "supertest";
import app from "../app";
import { Serie, Performance, User, Exercise } from "../models";

require("./setup");
describe("Serie API › POST /api/series", () => {
  let user: any;
  let exercise: any;
  let performance: any;

  beforeEach(async () => {
    user = await User.create({
      name: "Albert",
      mail: "test@test.com",
      password: "Password&123"
    });

    exercise = await Exercise.create({
      name: "Bench Press",
      category: "Chest",
      muscles: "pectoraux"
    });

    performance = await Performance.create({
      date: new Date(),
      userId: user.id,
      exerciseId: exercise.id
    });
  });

  const fakePerformanceId = "11111111-1111-1111-1111-111111111111";

  // ============================
  // ✅ SUCCESS
  // ============================
  it("devrait créer une série", async () => {
    const performance = await Performance.create({
      date: new Date(),
      userId: user.id,
      exerciseId: exercise.id,
      notes: "Séance test",
    });

    const response = await request(app)
      .post("/api/series")
      .send({
        repetitions: 10,
        weight: 80,
        unit: "kg",
        performanceId: performance.id,
      })
      .expect(201);

    expect(response.body.message).toBe("Performance créé avec succès");
    expect(response.body.serie.repetitions).toBe(10);
  });

  // ============================
  // ❌ CHAMPS MANQUANTS
  // ============================
  it("devrait retourner 400 si un champ est manquant", async () => {
    const response = await request(app)
      .post("/api/series")
      .send({
        repetitions: 10,
        weight: 80,
      })
      .expect(400);

    expect(response.body.error).toBe(
      "Repetitions, poid, unité et performanceId requis",
    );
  });

  // ============================
  // ❌ PERFORMANCE INTROUVABLE
  // ============================
  it("devrait retourner 404 si la performance n'existe pas", async () => {
    const response = await request(app)
      .post("/api/series")
      .send({
        repetitions: 10,
        weight: 80,
        unit: "kg",
        performanceId: fakePerformanceId,
      })
      .expect(404);

    expect(response.body.message).toBe("Exercice non trouvé");
  });
  
});
