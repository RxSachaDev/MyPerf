process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../app";
import { User } from "../models";

require("./setup");

describe("User Registration", () => {
  describe("POST /api/auth/register", () => {
    it("devrait créer un nouvel utilisateur avec succès", async () => {
      const userData = {
        name: "Sacha",
        mail: "sacha.test@test.com",
        password: "Test&385",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty("message", "Inscription réussie");
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toHaveProperty("mail", userData.mail);
      expect(response.body.user).not.toHaveProperty("password");

      // Vérifier en base de données de TEST
      const userInDb = await User.findOne({ where: { mail: userData.mail } });
      expect(userInDb).toBeTruthy();
      expect(userInDb?.name).toBe(userData.name);
    });

    it("devrait renvoyer une erreur 409 car le mail est déjà utiliser", async () => {
      const userData = {
        name: "Sacha",
        mail: "sacha.test@test.com",
        password: "Test&385",
      };

      await request(app).post("/api/auth/register").send(userData);

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(409);

      expect(response.body).toHaveProperty("error", "Email déjà utilisé");
      expect(response.body).toHaveProperty(
        "message",
        "Un compte existe déjà avec cet email",
      );
    });
  });

  it("devraait retourner une erreur 400 car le mail est invalide", async () => {
    const userData = {
        name: "Sacha",
        mail: "sacha.test@test",
        password: "Test&385",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);
  })

  it("devraait retourner une erreur 400 car le mot de passe est invalide", async () => {
    const userData = {
        name: "Sacha",
        mail: "sacha.test@test.com",
        password: "test",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(400);
  })
});
