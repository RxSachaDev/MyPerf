// tests/exercise.test.ts
process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../app";
import { Exercise } from "../models";

require("./setup");

describe('Exercise API', () => {

  // =============================================
  // POST /api/exercises/ - Créer un exercice
  // =============================================
  
  describe('POST /api/exercises/', () => {
    
    it('devrait créer un nouvel exercice avec succès', async () => {
      const exerciseData = {
        name: 'Développé couché',
        category: 'Haut du corps',
        muscles: 'Pectoraux'
      };

      const response = await request(app)
        .post('/api/exercises/')
        .send(exerciseData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Exercice créé avec succès');
      expect(response.body.exercise).toMatchObject({
        name: 'Développé couché',
        category: 'Haut du corps',
        muscles: 'Pectoraux'
      });
      expect(response.body.exercise).toHaveProperty('id');
      expect(response.body.exercise).toHaveProperty('createdAt');
      expect(response.body.exercise).toHaveProperty('updatedAt');
    });

    it('devrait créer plusieurs exercices différents', async () => {
      const exercises = [
        { name: 'Squat', category: 'Bas du corps', muscles: 'Quadriceps' },
        { name: 'Deadlift', category: 'Full body', muscles: 'Dos, Jambes' },
        { name: 'Pull-up', category: 'Haut du corps', muscles: 'Dorsaux' }
      ];

      for (const exerciseData of exercises) {
        const response = await request(app)
          .post('/api/exercises/')
          .send(exerciseData)
          .expect(201);

        expect(response.body.exercise.name).toBe(exerciseData.name);
      }

      // Vérifier en DB
      const count = await Exercise.count();
      expect(count).toBe(3);
    });

    it('devrait retourner une erreur si le nom existe déjà', async () => {
      const exerciseData = {
        name: 'Développé couché',
        category: 'Haut du corps',
        muscles: 'Pectoraux'
      };

      // Créer le premier exercice
      await request(app)
        .post('/api/exercises/')
        .send(exerciseData)
        .expect(201);

      // Essayer de créer le même exercice
      const response = await request(app)
        .post('/api/exercises/')
        .send(exerciseData)
        .expect(409);

      expect(response.body).toHaveProperty('error', 'Nom d\'exercice déjà utilisé');
      expect(response.body).toHaveProperty('message', 'Un exercice existe déjà avec ce nom');
    });

    it('devrait retourner une erreur si le nom est manquant', async () => {
      const response = await request(app)
        .post('/api/exercises/')
        .send({ 
          category: 'Haut du corps',
          muscles: 'Pectoraux'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Nom, category et muscle(s) de l\'exercice requis');
    });

    it('devrait retourner une erreur si la catégorie est manquante', async () => {
      const response = await request(app)
        .post('/api/exercises/')
        .send({ 
          name: 'Développé couché',
          muscles: 'Pectoraux'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Nom, category et muscle(s) de l\'exercice requis');
    });

    it('devrait retourner une erreur si les muscles sont manquants', async () => {
      const response = await request(app)
        .post('/api/exercises/')
        .send({ 
          name: 'Développé couché',
          category: 'Haut du corps'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Nom, category et muscle(s) de l\'exercice requis');
    });

    it('devrait retourner une erreur si tous les champs sont manquants', async () => {
      const response = await request(app)
        .post('/api/exercises/')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Nom, category et muscle(s) de l\'exercice requis');
    });

    it('devrait accepter des caractères spéciaux dans le nom', async () => {
      const response = await request(app)
        .post('/api/exercises/')
        .send({
          name: 'Développé à 45°',
          category: 'Haut du corps',
          muscles: 'Pectoraux supérieurs'
        })
        .expect(201);

      expect(response.body.exercise.name).toBe('Développé à 45°');
    });

    it('devrait gérer les noms avec des espaces', async () => {
      const response = await request(app)
        .post('/api/exercises/')
        .send({
          name: '  Développé couché  ',
          category: 'Haut du corps',
          muscles: 'Pectoraux'
        })
        .expect(201);

      // Devrait trim automatiquement ou accepter avec espaces
      expect(response.body.exercise.name.trim()).toBe('Développé couché');
    });
  });

  // =============================================
  // GET /api/exercises - Récupérer des exercices
  // =============================================
  
  describe('GET /api/exercises', () => {
    
    beforeEach(async () => {
      // Créer des exercices pour les tests
      await Exercise.create({
        name: 'Développé couché',
        category: 'Haut du corps',
        muscles: 'Pectoraux'
      });

      await Exercise.create({
        name: 'Squat',
        category: 'Bas du corps',
        muscles: 'Quadriceps'
      });

      await Exercise.create({
        name: 'Dips',
        category: 'Haut du corps',
        muscles: 'Triceps'
      });

      await Exercise.create({
        name: 'Pull-up',
        category: 'Haut du corps',
        muscles: 'Dorsaux'
      });
    });

    // Tests sans filtre (tous les exercices)
    it('devrait récupérer tous les exercices sans filtre', async () => {
      const response = await request(app)
        .get('/api/exercises')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Exercices récupérés');
      expect(response.body.exercises).toHaveLength(4);
      expect(response.body.exercises[0]).toHaveProperty('id');
      expect(response.body.exercises[0]).toHaveProperty('name');
      expect(response.body.exercises[0]).toHaveProperty('category');
      expect(response.body.exercises[0]).toHaveProperty('muscles');
    });

    // Tests par nom
    it('devrait trouver un exercice par nom exact', async () => {
      const response = await request(app)
        .get('/api/exercises')
        .query({ name: 'Développé couché' })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Exercice récupéré');
      expect(response.body.exercise).toMatchObject({
        name: 'Développé couché',
        category: 'Haut du corps',
        muscles: 'Pectoraux'
      });
    });

    it('devrait ne pas trouver un exercice avec un nom inexistant', async () => {
      const response = await request(app)
        .get('/api/exercises')
        .query({ name: 'Pullover' })
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Exercice non trouvé');
    });

    it('devrait être sensible à la casse pour le nom (selon votre implémentation)', async () => {
      const response = await request(app)
        .get('/api/exercises')
        .query({ name: 'développé couché' })
        // Peut être 200 ou 404 selon si vous normalisez
        .expect((res) => {
          expect([200, 404]).toContain(res.status);
        });
    });

    // Tests par catégorie
    it('devrait trouver des exercices par catégorie', async () => {
      const response = await request(app)
        .get('/api/exercises')
        .query({ category: 'Haut du corps' })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Exercices récupérés');
      expect(response.body.exercises).toHaveLength(3);
      
      response.body.exercises.forEach((exercise: any) => {
        expect(exercise.category).toBe('Haut du corps');
      });
    });

    it('devrait retourner un tableau vide si aucune catégorie ne correspond', async () => {
      const response = await request(app)
        .get('/api/exercises')
        .query({ category: 'Catégorie inexistante' })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Aucun exercice trouvé');
      expect(response.body.exercises).toHaveLength(0);
    });

    // Tests par muscle
    it('devrait trouver des exercices par muscle', async () => {
      const response = await request(app)
        .get('/api/exercises')
        .query({ muscles: 'Pectoraux' })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Exercices récupérés');
      expect(response.body.exercises).toHaveLength(1);
      expect(response.body.exercises[0]).toMatchObject({
        name: 'Développé couché',
        muscles: 'Pectoraux'
      });
    });

    it('devrait retourner un tableau vide si aucun muscle ne correspond', async () => {
      const response = await request(app)
        .get('/api/exercises')
        .query({ muscles: 'Muscle inexistant' })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Aucun exercice trouvé');
      expect(response.body.exercises).toHaveLength(0);
    });

    // Tests par catégorie ET muscle
    it('devrait trouver des exercices par catégorie ET muscle', async () => {
      const response = await request(app)
        .get('/api/exercises')
        .query({ 
          category: 'Haut du corps',
          muscles: 'Triceps'
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Exercices récupérés');
      expect(response.body.exercises).toHaveLength(1);
      expect(response.body.exercises[0].name).toBe('Dips');
    });

    it('devrait retourner un tableau vide si catégorie ET muscle ne correspondent pas', async () => {
      const response = await request(app)
        .get('/api/exercises')
        .query({ 
          category: 'Bas du corps',
          muscles: 'Pectoraux'  // Incompatible
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Aucun exercice trouvé');
      expect(response.body.exercises).toHaveLength(0);
    });

    // Tests par ID
    it('devrait récupérer un exercice par ID', async () => {
      const exercises = await Exercise.findAll();
      const exerciseId = exercises[0].id;

      const response = await request(app)
        .get('/api/exercises')
        .query({ id: exerciseId })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Exercice récupéré');
      expect(response.body.exercise.id).toBe(exerciseId);
    });

    it('devrait retourner 404 pour un ID inexistant', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app)
        .get('/api/exercises')
        .query({ id: fakeId })
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Exercice non trouvé');
    });

    // Tests de priorité des filtres
    it('devrait prioriser la recherche par ID sur le nom', async () => {
      const exercises = await Exercise.findAll();
      const exerciseId = exercises[0].id;

      const response = await request(app)
        .get('/api/exercises')
        .query({ 
          id: exerciseId,
          name: 'Autre nom'  // Devrait être ignoré
        })
        .expect(200);

      expect(response.body.exercise.id).toBe(exerciseId);
    });

    // Tests de cas limites
    it('devrait gérer les query params vides', async () => {
      const response = await request(app)
        .get('/api/exercises')
        .query({ name: '' })
        .expect(200);

      // Devrait retourner tous les exercices ou message spécifique
      expect(response.body).toHaveProperty('exercises');
    });
  });

  // =============================================
  // PUT /api/exercises/:id - Modifier un exercice
  // =============================================
  
  describe('PUT /api/exercises/:id', () => {
    
    let exerciseId: string;

    beforeEach(async () => {
      const exercise = await Exercise.create({
        name: 'Développé couché',
        category: 'Haut du corps',
        muscles: 'Pectoraux'
      });
      exerciseId = exercise.id;
    });

    it('devrait modifier tous les champs d\'un exercice', async () => {
      const updatedData = {
        name: 'Développé incliné',
        category: 'Haut du corps - Incliné',
        muscles: 'Pectoraux supérieurs'
      };

      const response = await request(app)
        .put(`/api/exercises/${exerciseId}`)
        .send(updatedData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Exercice modifié avec succès');
      expect(response.body.exercise).toMatchObject({
        id: exerciseId,
        name: 'Développé incliné',
        category: 'Haut du corps - Incliné',
        muscles: 'Pectoraux supérieurs'
      });
    });

    it('devrait modifier uniquement le nom', async () => {
      const response = await request(app)
        .put(`/api/exercises/${exerciseId}`)
        .send({ name: 'Bench Press' })
        .expect(200);

      expect(response.body.exercise).toMatchObject({
        name: 'Bench Press',
        category: 'Haut du corps',
        muscles: 'Pectoraux'
      });
    });

    it('devrait modifier uniquement la catégorie', async () => {
      const response = await request(app)
        .put(`/api/exercises/${exerciseId}`)
        .send({ category: 'Poussée' })
        .expect(200);

      expect(response.body.exercise.category).toBe('Poussée');
    });

    it('devrait modifier uniquement les muscles', async () => {
      const response = await request(app)
        .put(`/api/exercises/${exerciseId}`)
        .send({ muscles: 'Pectoraux, Triceps' })
        .expect(200);

      expect(response.body.exercise.muscles).toBe('Pectoraux, Triceps');
    });

    it('devrait retourner 404 si l\'exercice n\'existe pas', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app)
        .put(`/api/exercises/${fakeId}`)
        .send({ name: 'Nouveau nom' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Exercice introuvable');
    });

    it('devrait retourner 400 si aucune donnée n\'est fournie', async () => {
      const response = await request(app)
        .put(`/api/exercises/${exerciseId}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Aucune donnée à modifier');
    });

    it('devrait retourner 409 si le nouveau nom existe déjà', async () => {
      await Exercise.create({
        name: 'Squat',
        category: 'Bas du corps',
        muscles: 'Quadriceps'
      });

      const response = await request(app)
        .put(`/api/exercises/${exerciseId}`)
        .send({ name: 'Squat' })
        .expect(409);

      expect(response.body).toHaveProperty('error', 'Nom d\'exercice déjà utilisé');
    });

    it('devrait permettre de garder le même nom lors de la modification', async () => {
      const response = await request(app)
        .put(`/api/exercises/${exerciseId}`)
        .send({ 
          name: 'Développé couché',
          muscles: 'Pectoraux + Triceps'
        })
        .expect(200);

      expect(response.body.exercise.name).toBe('Développé couché');
      expect(response.body.exercise.muscles).toBe('Pectoraux + Triceps');
    });

    it('devrait persister les modifications en base de données', async () => {
      await request(app)
        .put(`/api/exercises/${exerciseId}`)
        .send({ name: 'Nouveau nom' })
        .expect(200);

      const exerciseInDb = await Exercise.findById(exerciseId);
      expect(exerciseInDb).toBeTruthy();
      expect(exerciseInDb!.name).toBe('Nouveau nom');
    });
  });

  describe('DELETE /api/exercises/:id', () => {
    
    let exerciseId: string;

    beforeEach(async () => {
      // Créer un exercice pour les tests de suppression
      const exercise = await Exercise.create({
        name: 'Développé couché',
        category: 'Haut du corps',
        muscles: 'Pectoraux'
      });
      exerciseId = exercise.id;
    });

    it('devrait supprimer un exercice existant', async () => {
      const response = await request(app)
        .delete(`/api/exercises/${exerciseId}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Exercice supprimé avec succès');
      expect(response.body.deletedExercise).toMatchObject({
        id: exerciseId,
        name: 'Développé couché'
      });
    });

    it('devrait vérifier que l\'exercice n\'existe plus en base de données', async () => {
      await request(app)
        .delete(`/api/exercises/${exerciseId}`)
        .expect(200);

      // Vérifier que l'exercice n'existe plus
      const deletedExercise = await Exercise.findById(exerciseId);
      expect(deletedExercise).toBeNull();
    });

    it('devrait retourner 404 si l\'exercice n\'existe pas', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app)
        .delete(`/api/exercises/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Exercice introuvable');
      expect(response.body).toHaveProperty('message', 'Aucun exercice trouvé avec cet ID');
    });

    it('devrait permettre de supprimer plusieurs exercices successivement', async () => {
      // Créer 3 exercices
      const exercise1 = await Exercise.create({
        name: 'Squat',
        category: 'Bas du corps',
        muscles: 'Quadriceps'
      });

      const exercise2 = await Exercise.create({
        name: 'Dips',
        category: 'Haut du corps',
        muscles: 'Triceps'
      });

      const exercise3 = await Exercise.create({
        name: 'Pull-up',
        category: 'Haut du corps',
        muscles: 'Dorsaux'
      });

      // Vérifier qu'il y a 4 exercices (+ celui du beforeEach)
      const countBefore = await Exercise.count();
      expect(countBefore).toBe(4);

      // Supprimer les 3 nouveaux
      await request(app).delete(`/api/exercises/${exercise1.id}`).expect(200);
      await request(app).delete(`/api/exercises/${exercise2.id}`).expect(200);
      await request(app).delete(`/api/exercises/${exercise3.id}`).expect(200);

      // Vérifier qu'il reste 1 exercice
      const countAfter = await Exercise.count();
      expect(countAfter).toBe(1);
    });

    it('devrait retourner une erreur si on tente de supprimer deux fois le même exercice', async () => {
      // Première suppression
      await request(app)
        .delete(`/api/exercises/${exerciseId}`)
        .expect(200);

      // Deuxième suppression (doit échouer)
      const response = await request(app)
        .delete(`/api/exercises/${exerciseId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Exercice introuvable');
    });

    it('devrait supprimer un exercice même s\'il a des caractères spéciaux', async () => {
      const exercise = await Exercise.create({
        name: 'Développé à 45°',
        category: 'Haut du corps',
        muscles: 'Pectoraux supérieurs'
      });

      const response = await request(app)
        .delete(`/api/exercises/${exercise.id}`)
        .expect(200);

      expect(response.body.deletedExercise.name).toBe('Développé à 45°');
    });

    it('ne devrait pas affecter les autres exercices lors de la suppression', async () => {
      // Créer un autre exercice
      const otherExercise = await Exercise.create({
        name: 'Squat',
        category: 'Bas du corps',
        muscles: 'Quadriceps'
      });

      // Supprimer le premier exercice
      await request(app)
        .delete(`/api/exercises/${exerciseId}`)
        .expect(200);

      // Vérifier que l'autre existe toujours
      const stillExists = await Exercise.findById(otherExercise.id);
      expect(stillExists).toBeTruthy();
      expect(stillExists!.name).toBe('Squat');
    });

    it('devrait gérer correctement les UUIDs valides mais inexistants', async () => {
      // UUID valide mais qui n'existe pas en DB
      const validButNonExistentId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await request(app)
        .delete(`/api/exercises/${validButNonExistentId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Exercice introuvable');
    });
  });
});