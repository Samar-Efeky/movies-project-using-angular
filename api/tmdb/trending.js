// api/tmdb/trending.js
export async function GET(request) {
  try {
    // Parse query params from the request URL
    const url = new URL(request.url);
    const category = url.searchParams.get('category') || 'all'; // media type: all, movie, tv, person
    const page = url.searchParams.get('page') || '1';           // pagination, default 1
    const time = url.searchParams.get('time') || 'day';         // time window: 'day' or 'week'

    // Get TMDB API token from environment variables
    const token = process.env.TMDB_API_TOKEN;
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Server missing TMDB_API_TOKEN' }),
        { status: 500 }
      );
    }

    // Build TMDB trending API URL
    // Format: /trending/{media_type}/{time_window}
    const tmdbUrl = `https://api.themoviedb.org/3/trending/${category}/${time}?page=${page}`;

    // Call TMDB API with Bearer token
    const resp = await fetch(tmdbUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });

    // Parse TMDB response into JSON
    const data = await resp.json();

    // Return data to client with CORS enabled
    return new Response(JSON.stringify(data), {
      status: resp.status,
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*' // in production, replace * with your frontend domain
      }
    });
  } catch (err) {
    // Handle unexpected errors
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
}
