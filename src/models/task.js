const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'todo_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
});

const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255),
      description TEXT,
      status VARCHAR(50) DEFAULT 'todo',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
  `);
  console.log('Database initialized');
};

initDB().catch(err => console.error('Error initializing database:', err));

module.exports = {
  findAll: () => pool.query('SELECT * FROM tasks ORDER BY created_at DESC'),
  findById: (id) => pool.query('SELECT * FROM tasks WHERE id = $1', [id]),
  create: ({ title, description, status = 'todo' }) =>
    pool.query(
      'INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3) RETURNING *',
      [title, description, status]
    ),
  update: (id, { title, description, status }) =>
    pool.query(
      'UPDATE tasks SET title=$1, description=$2, status=$3, updated_at=NOW() WHERE id=$4 RETURNING *',
      [title, description, status, id]
    ),
  remove: (id) => pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]),
};