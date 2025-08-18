// api/tmdb/search.js
export async function GET(request) {
  try {
    // Parse the incoming request URL
    const url = new URL(request.url);

    // Get query params:
    // q = search keyword (movie, tv show, or person)
    // page = pagination number (default 1)
    const q = url.searchParams.get('query') || '';
    const page = url.searchParams.get('page') || '1';

    // Get TMDB API token from environment variables
    const token = process.env.TMDB_API_TOKEN;
    if (!token) 
      return new Response(JSON.stringify({ error: 'Server missing TMDB_API_TOKEN' }), { status: 500 });

    // Build the TMDB API URL for multi-search
    // multi = searches movies, tv series, and people in one request
    const tmdbUrl = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(q)}&language=en-US&page=${page}&include_adult=false`;

    // Send request to TMDB API with Bearer token
    const resp = await fetch(tmdbUrl, { 
      headers: { 
        Authorization: `Bearer ${token}`, 
        Accept: 'application/json' 
      } 
    });

    // Parse TMDB response as JSON
    const data = await resp.json();

    // Return the response with CORS header (allow all origins)
    return new Response(JSON.stringify(data), { 
      status: resp.status, 
      headers: { 
        'content-type': 'application/json', 
        'Access-Control-Allow-Origin': '*' // in production, replace * with specific origin
      }
    });

  } catch (err) {
    // Handle unexpected errors (server-side)
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, 
      headers: { 'content-type': 'application/json' }
    });
  }
}
