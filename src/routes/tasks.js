const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// GET /api/tasks
router.get('/', async (req, res, next) => {
  try {
    const result = await Task.findAll();
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res, next) => {
  try {
    const result = await Task.findById(req.params.id);
    if (!result.rows[0]) return res.status(404).json({ error: 'Task not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks
router.post('/', async (req, res, next) => {
  try {
    const { title, description, status } = req.body || {};
    if (!description) return res.status(400).json({ error: 'description is required' });
    const result = await Task.create({ title, description, status });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const result = await Task.update(req.params.id, { title, description, status });
    if (!result.rows[0]) return res.status(404).json({ error: 'Task not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await Task.remove(req.params.id);
    if (!result.rows[0]) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted', task: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;