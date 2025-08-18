// api/tmdb/trending.js
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category') || 'all'; // all/movie/tv/person
    const page = url.searchParams.get('page') || '1';
    const time = url.searchParams.get('time') || 'day'; // default day

    const token = process.env.TMDB_API_TOKEN;
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Server missing TMDB_API_TOKEN' }),
        { status: 500 }
      );
    }

    // TMDB expects /trending/{media_type}/{time_window}
    const tmdbUrl = `https://api.themoviedb.org/3/trending/${category}/${time}?page=${page}`;

    const resp = await fetch(tmdbUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });

    const data = await resp.json();

    return new Response(JSON.stringify(data), {
      status: resp.status,
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
}
