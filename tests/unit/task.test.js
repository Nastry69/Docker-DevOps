// Test unitaire : on teste le modèle task.js de manière isolée
// On mock (simule) la base de données pour ne pas avoir besoin de PostgreSQL

const mockQuery = jest.fn(); // fonction simulée qui remplace pool.query

// On mock le module 'pg' AVANT d'importer task.js
jest.mock('pg', () => {
  return {
    Pool: jest.fn(() => ({
      query: mockQuery,
    })),
  };
});

const Task = require('../../src/models/task');

// On regroupe les tests par thème avec describe()
describe('Task Model', () => {

  // Avant chaque test, on remet le mock à zéro
  beforeEach(() => {
    mockQuery.mockClear();
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      // ARRANGE : on définit ce que le mock doit retourner
      const fakeTasks = [
        { id: '1', description: 'Tâche 1', status: 'todo' },
        { id: '2', description: 'Tâche 2', status: 'done' },
      ];
      mockQuery.mockResolvedValueOnce({ rows: fakeTasks });

      // ACT : on appelle la fonction à tester
      const result = await Task.findAll();

      // ASSERT : on vérifie le résultat
      expect(result.rows).toHaveLength(2);
      expect(result.rows[0].description).toBe('Tâche 1');
      // on vérifie que la bonne requête SQL a été appelée
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM tasks ORDER BY created_at DESC'
      );
    });
  });

  describe('findById', () => {
    it('should return a task by id', async () => {
      const fakeTask = { id: 'abc-123', description: 'Test', status: 'todo' };
      mockQuery.mockResolvedValueOnce({ rows: [fakeTask] });

      const result = await Task.findById('abc-123');

      expect(result.rows[0].id).toBe('abc-123');
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM tasks WHERE id = $1',
        ['abc-123']
      );
    });

    it('should return empty if task not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const result = await Task.findById('inexistant');

      expect(result.rows).toHaveLength(0);
    });
  });

  describe('create', () => {
    it('should create a task and return it', async () => {
      const newTask = {
        id: 'new-uuid',
        title: 'Mon titre',
        description: 'Ma description',
        status: 'todo',
      };
      mockQuery.mockResolvedValueOnce({ rows: [newTask] });

      const result = await Task.create({
        title: 'Mon titre',
        description: 'Ma description',
        status: 'todo',
      });

      expect(result.rows[0].description).toBe('Ma description');
      expect(result.rows[0].status).toBe('todo');
    });

    it('should use default status "todo" if not provided', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ status: 'todo' }] });

      await Task.create({ description: 'Sans status' });

      // vérifie que 'todo' est bien passé en 3ème paramètre SQL
      expect(mockQuery).toHaveBeenCalledWith(
        expect.any(String),
        [undefined, 'Sans status', 'todo']
      );
    });
  });

  describe('update', () => {
    it('should update a task and return it', async () => {
      const updatedTask = { id: 'abc', description: 'Modifiée', status: 'done' };
      mockQuery.mockResolvedValueOnce({ rows: [updatedTask] });

      const result = await Task.update('abc', {
        title: null,
        description: 'Modifiée',
        status: 'done',
      });

      expect(result.rows[0].status).toBe('done');
    });
  });

  describe('remove', () => {
    it('should delete a task and return it', async () => {
      const deletedTask = { id: 'abc', description: 'Supprimée' };
      mockQuery.mockResolvedValueOnce({ rows: [deletedTask] });

      const result = await Task.remove('abc');

      expect(result.rows[0].id).toBe('abc');
      expect(mockQuery).toHaveBeenCalledWith(
        'DELETE FROM tasks WHERE id = $1 RETURNING *',
        ['abc']
      );
    });
  });
});