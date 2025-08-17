// api/tmdb/details.js
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const media = url.searchParams.get('media');
    const id = url.searchParams.get('id');
    const word = url.searchParams.get('word'); // optional subresource like 'credits' or 'videos'
    if (!media || !id) return new Response(JSON.stringify({ error: 'Missing params' }), { status: 400 });

    const token = process.env.TMDB_API_TOKEN;
    if (!token) return new Response(JSON.stringify({ error: 'Server missing TMDB_API_TOKEN' }), { status: 500 });

    const suffix = word ? `/${word}` : '';
    const tmdbUrl = `https://api.themoviedb.org/3/${media}/${id}${suffix}?language=en-US`;
    const resp = await fetch(tmdbUrl, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }});
    const data = await resp.json();
    return new Response(JSON.stringify(data), { status: resp.status, headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }});
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'content-type': 'application/json' }});
  }
}
