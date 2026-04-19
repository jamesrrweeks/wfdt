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
        max_tokens: 1000,
        messages: [{
          role: 'user',
content: `You are a recipe parser. The user has pasted text that may contain a recipe. Extract it and return ONLY a valid JSON object with these exact fields: name (string), description (string, one sentence), cuisine (string, e.g. "Italian"), time (string, e.g. "30 mins"), calories (number), servings (number), icon (one of exactly: "Chicken", "Beef & Lamb", "Seafood", "Vegetarian", "Rice & Grains", "Pasta & Noodles", "Bread & Wraps", "Potato & Root" — pick the best match), ingredients (array of {name, amount, unit}), method (array of step strings). If you cannot parse a valid recipe from the text, return ONLY the word ERROR and nothing else.\n\nText:\n${req.body.text}`,        }],
      }),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
