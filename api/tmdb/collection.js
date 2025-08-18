// api/tmdb/collection.js
export async function GET(request) {
  try {
    // Parse the incoming request URL
    const url = new URL(request.url);

    // Get query parameters: media type (movie/tv), category (popular, top_rated, etc.), and page number
    const media = url.searchParams.get('media');      // e.g. 'movie' or 'tv'
    const category = url.searchParams.get('category'); // e.g. 'popular'
    const page = url.searchParams.get('page') || '1'; // default page = 1

    // Validate required params
    if (!media || !category) 
      return new Response(JSON.stringify({ error: 'Missing params' }), { status: 400 });

    // Get TMDB API token from environment variables
    const token = process.env.TMDB_API_TOKEN;
    if (!token) 
      return new Response(JSON.stringify({ error: 'Server missing TMDB_API_TOKEN' }), { status: 500 });

    // Build the TMDB API URL
    const tmdbUrl = `https://api.themoviedb.org/3/${media}/${category}?language=en-US&page=${page}`;

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
