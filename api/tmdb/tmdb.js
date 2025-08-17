// api/tmdb.js
export default function handler(req, res) {
  const { action, media, category, page } = req.query;

  if (action === "collection") {
    res.status(200).json({
      media,
      category,
      page,
      results: [`Example data for ${media}/${category} page ${page}`]
    });
  } else {
    res.status(400).json({ error: "Invalid action" });
  }
}
