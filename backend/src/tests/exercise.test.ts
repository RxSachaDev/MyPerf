process.env.NODE_ENV = "test";

import request from "supertest";
import app from "../app";
import { Exercise } from "../models";

require("./setup");

describe('Exercise CRUD', () => {
	describe('POST /api/exercises/create', () => {
		it('devrait créer un nouvel exercice avec succés', async () => {
			const exerciseData = {
				name: 'développé couché',
				category: 'haut du corp',
				muscles: 'pectoraux'
			}

			const response = await request(app)
				.post('/api/exercises/create')
				.send(exerciseData)
				.expect(201)
		})

		it('devrait ne pas créer un nouvel exercice avec succés avec erreur 400', async () => {
			const exerciseData = {
				category: 'haut du corp',
				muscles: 'pectoraux'
			}

			const response = await request(app)
				.post('/api/exercises/create')
				.send(exerciseData)
				.expect(400)
		})

		it('devrait ne pas créer un nouvel exercice avec succés avec erreur 409', async () => {
			const exerciseData = {
				name: 'développé couché',
				category: 'haut du corp',
				muscles: 'pectoraux'
			}

			await request(app).post('/api/exercises/create').send(exerciseData)

			const response = await request(app)
				.post('/api/exercises/create')
				.send(exerciseData)
				.expect(409)
		})

		it('devrait trouver l\'exercice recherché', async () => {
			const exerciseData = {
				name: 'développé couché',
				category: 'haut du corp',
				muscles: 'pectoraux'
			}

			await request(app).post('/api/exercises/create').send(exerciseData)

			const response = await request(app)
				.get('/api/exercises')
				.query({ name: 'développé couché' })
				.expect(200)
		})

		it('devrait ne pas trouver l\'exercice recherché', async () => {
			const exerciseData = {
				name: 'développé couché',
				category: 'haut du corp',
				muscles: 'pectoraux'
			}

			await request(app).post('/api/exercises/create').send(exerciseData)

			const response = await request(app)
				.get('/api/exercises')
				.query({ name: 'pullover' })
				.expect(404)
		})
	})
})