// api/tmdb.js
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const token = process.env.TMDB_API_TOKEN;
  if (!token) return res.status(500).json({ error: 'Server misconfigured: missing TMDB_API_TOKEN' });

  const { action, media, category, page = '1', query, id, word, time_window = 'day' } = req.query;

  let url;
  if (action === 'search') {
    url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query || '')}&language=en-US&page=${page}&include_adult=false`;
  } else if (action === 'details') {
    url = `https://api.themoviedb.org/3/${media}/${id}?language=en-US`;
  } else if (action === 'extra') {
    url = `https://api.themoviedb.org/3/${media}/${id}/${word}?language=en-US`;
  } else if (action === 'trending') {
    url = `https://api.themoviedb.org/3/trending/${media}/${time_window}?language=en-US&page=${page}`;
  } else {
    url = `https://api.themoviedb.org/3/${media}/${category}?language=en-US&page=${page}`;
  }

  try {
    const r = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
      },
    });
    const data = await r.json();
    return res.status(r.ok ? 200 : 502).json(data);
  } catch (err) {
    console.error('TMDb proxy error:', err);
    return res.status(500).json({ error: err.message });
  }
}
