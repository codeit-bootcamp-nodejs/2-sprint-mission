const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');

const app = express();
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const upload = multer({ dest: `${UPLOAD_DIR}/` });

// Postgres 연결정보는 docker-compose에서 environment로 전달됩니다.
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASSWORD || 'mypassword',
  database: process.env.DB_NAME || 'mydb',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  res.json({
    message: 'File uploaded',
    originalName: req.file.originalname,
    storedAs: req.file.filename,
    path: req.file.path
  });
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS now');
    res.json({ server: 'ok', dbNow: result.rows[0].now });
  } catch (err) {
    console.error('DB error:', err.message || err);
    res.status(500).json({ error: 'DB error', detail: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Express server listening on ${PORT}`));
