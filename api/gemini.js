// api/gemini.js
export async function POST(request) {
  try {
    // Read request body as JSON
    const body = await request.json();
    const prompt = body.prompt;

    // If no prompt is provided, return error response
    if (!prompt) return new Response(JSON.stringify({ error: 'Missing prompt' }), { status: 400 });

    // Get API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key is found, return error response
    if (!apiKey) return new Response(JSON.stringify({ error: 'Server missing GEMINI_API_KEY' }), { status: 500 });

    // Google Gemini API endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Send request to Gemini API
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [ { parts: [{ text: prompt }] } ] })
    });

    // Convert Gemini API response to JSON
    const data = await resp.json();

    // Return the Gemini response with CORS header
    return new Response(JSON.stringify(data), {
      status: resp.status,
      headers: { 
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*' // in production, replace * with specific origin
      }
    });

  } catch (err) {
    // Handle any unexpected server errors
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, 
      headers: { 'content-type': 'application/json' }
    });
  }
}
