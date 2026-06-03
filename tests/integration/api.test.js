// Test d'intégration : on teste les routes HTTP avec supertest
// supertest simule de vraies requêtes HTTP sans lancer un vrai serveur
// On mock quand même la DB pour ne pas dépendre de PostgreSQL

const request = require('supertest');
const { app, server } = require('../../src/app');

afterAll(() => {
  server.close();
});

// Mock complet du modèle Task pour isoler l'API de la DB
jest.mock('../../src/models/task', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

const Task = require('../../src/models/task');

describe('Tasks API', () => {

  beforeEach(() => {
    jest.clearAllMocks(); // remet tous les mocks à zéro entre chaque test
  });

  // ===== GET /api/tasks =====
  describe('GET /api/tasks', () => {
    it('should return 200 and list of tasks', async () => {
      Task.findAll.mockResolvedValueOnce({
        rows: [{ id: '1', description: 'Tâche 1', status: 'todo' }],
      });

      const res = await request(app).get('/api/tasks');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].description).toBe('Tâche 1');
    });

    it('should return empty array if no tasks', async () => {
      Task.findAll.mockResolvedValueOnce({ rows: [] });

      const res = await request(app).get('/api/tasks');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  // ===== GET /api/tasks/:id =====
  describe('GET /api/tasks/:id', () => {
    it('should return 200 and a single task', async () => {
      Task.findById.mockResolvedValueOnce({
        rows: [{ id: 'abc-123', description: 'Test', status: 'todo' }],
      });

      const res = await request(app).get('/api/tasks/abc-123');

      expect(res.status).toBe(200);
      expect(res.body.id).toBe('abc-123');
    });

    it('should return 404 if task not found', async () => {
      Task.findById.mockResolvedValueOnce({ rows: [] });

      const res = await request(app).get('/api/tasks/inexistant');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Task not found');
    });
  });

  // ===== POST /api/tasks =====
  describe('POST /api/tasks', () => {
    it('should return 201 and the created task', async () => {
      const newTask = {
        id: 'new-uuid',
        description: 'Nouvelle tâche',
        status: 'todo',
      };
      Task.create.mockResolvedValueOnce({ rows: [newTask] });

      const res = await request(app)
        .post('/api/tasks')
        .send({ description: 'Nouvelle tâche', status: 'todo' });

      expect(res.status).toBe(201);
      expect(res.body.description).toBe('Nouvelle tâche');
    });

    it('should return 400 if description is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ status: 'todo' }); // pas de description

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('description is required');
    });
  });

  // ===== PUT /api/tasks/:id =====
  describe('PUT /api/tasks/:id', () => {
    it('should return 200 and the updated task', async () => {
      const updated = { id: 'abc', description: 'Modifiée', status: 'done' };
      Task.update.mockResolvedValueOnce({ rows: [updated] });

      const res = await request(app)
        .put('/api/tasks/abc')
        .send({ description: 'Modifiée', status: 'done' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('done');
    });

    it('should return 404 if task not found', async () => {
      Task.update.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .put('/api/tasks/inexistant')
        .send({ description: 'Test', status: 'todo' });

      expect(res.status).toBe(404);
    });
  });

  // ===== DELETE /api/tasks/:id =====
  describe('DELETE /api/tasks/:id', () => {
    it('should return 200 and the deleted task', async () => {
      Task.remove.mockResolvedValueOnce({
        rows: [{ id: 'abc', description: 'Supprimée' }],
      });

      const res = await request(app).delete('/api/tasks/abc');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Task deleted');
    });

    it('should return 404 if task not found', async () => {
      Task.remove.mockResolvedValueOnce({ rows: [] });

      const res = await request(app).delete('/api/tasks/inexistant');

      expect(res.status).toBe(404);
    });
  });

  // ===== /health =====
  describe('GET /health', () => {
    it('should return 200 with status ok', async () => {
      const res = await request(app).get('/health');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });
});