// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';

// Middlewares
app.use(helmet());
app.use(express.json({ limit: '1mb' })); 
app.use(morgan('dev'));
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET','POST','OPTIONS'],
}));


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 120 
});
app.use(limiter);


app.use('/api/tmdb', async (req, res) => {
  try {
    const tmdbPath = req.originalUrl.replace(/^\/api\/tmdb/, '');
    const tmdbUrl = `https://api.themoviedb.org/3${tmdbPath}`;

    const response = await axios({
      method: req.method,
      url: tmdbUrl,
      headers: {
        'Authorization': `Bearer ${process.env.TMDB_API_TOKEN}`,
        'accept': 'application/json'
      },
      data: req.body,
      timeout: 15000,
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    console.error('TMDB proxy error:', err?.response?.data || err.message);
    const status = err?.response?.status || 500;
    res.status(status).json({
      error: 'TMDB proxy error',
      detail: err?.response?.data || err.message
    });
  }
});

// ---- Gemini endpoint (POST)
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const endpoint = process.env.GEMINI_ENDPOINT;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const response = await axios.post(`${endpoint}?key=${apiKey}`, req.body, {
      timeout: 20000
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error('Gemini proxy error:', err?.response?.data || err.message);
    const status = err?.response?.status || 500;
    res.status(status).json({
      error: 'Gemini proxy error',
      detail: err?.response?.data || err.message
    });
  }
});

// health check
app.get('/api/health', (req, res) => res.json({ ok: true }));
const path = require('path');

// -------- Serve Angular frontend --------
const distPath = path.join(__dirname, '../dist/movies-project/browser');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});
// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend server listening on http://localhost:${PORT}`);
});

