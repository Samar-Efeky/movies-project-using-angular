// api/tmdb.js
export default function handler(req, res) {
  // Extract query parameters from the request URL
  const { action, media, category, page } = req.query;

  // If action is "collection", return a mock response
  if (action === "collection") {
    res.status(200).json({
      media,      // e.g. "movie" or "tv"
      category,   // e.g. "popular" or "top_rated"
      page,       // pagination number
      results: [`Example data for ${media}/${category} page ${page}`] // mock data
    });
  } else {
    // If action is not supported, return error
    res.status(400).json({ error: "Invalid action" });
  }
}
