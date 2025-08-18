// api/tmdb/details.js
export async function GET(request) {
  try {
    // Parse the incoming request URL
    const url = new URL(request.url);

    // Get query parameters:
    // media type (movie/tv/person), resource id, and optional subresource (e.g., 'credits', 'videos')
    const media = url.searchParams.get('media');
    const id = url.searchParams.get('id');
    const word = url.searchParams.get('word'); // optional

    // Validate required params
    if (!media || !id) 
      return new Response(JSON.stringify({ error: 'Missing params' }), { status: 400 });

    // Get TMDB API token from environment variables
    const token = process.env.TMDB_API_TOKEN;
    if (!token) 
      return new Response(JSON.stringify({ error: 'Server missing TMDB_API_TOKEN' }), { status: 500 });

    // If "word" param exists, append it to the URL (e.g., /credits or /videos)
    const suffix = word ? `/${word}` : '';

    // Build TMDB API URL
    const tmdbUrl = `https://api.themoviedb.org/3/${media}/${id}${suffix}?language=en-US`;

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
