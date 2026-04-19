export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-secret-token');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const token = req.headers['x-secret-token'];
  if (token !== process.env.API_SECRET_TOKEN) {
    return res.status(401).json({ error: 'Unauthorised' });
  }

  const { imageBase64, mediaType } = req.body;
  if (!imageBase64) return res.status(400).json({ error: 'No image provided' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType || 'image/jpeg', data: imageBase64 },
            },
            {
              type: 'text',
              text: `You are a recipe parser. Extract the recipe from this image and return ONLY a valid JSON object with no markdown, no backticks, and no explanation. If you cannot find a recognisable recipe, return only the word ERROR.\n\nThe JSON must have exactly these fields:\n- name (string)\n- description (1 sentence string)\n- icon (string — must be exactly one of: "Chicken", "Beef & Lamb", "Seafood", "Vegetarian", "Rice & Grains", "Pasta & Noodles", "Bread & Wraps", "Potato & Root")\n- cuisine (string)\n- time (string, e.g. "30 mins")\n- calories (number, per serving — estimate if not stated)\n- servings (number)\n- ingredients (array of objects: { "name": string, "amount": string, "source": "ai", "suggestions": [] })\n- macros (object: { "protein": number, "carbs": number, "fat": number } — percentages adding to 100)\n- method (array of step strings)`,
            },
          ],
        }],
      }),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
