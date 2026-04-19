export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const token = req.headers["x-secret-token"];
  if (token !== process.env.API_SECRET_TOKEN) return res.status(401).json({ error: "Unauthorized" });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "No URL provided" });

  // Step 1: Fetch the page
  let html;
  try {
    const pageRes = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; recipe-importer/1.0)" },
    });
    if (!pageRes.ok) throw new Error(`HTTP ${pageRes.status}`);
    html = await pageRes.text();
  } catch {
    return res.status(200).json({ content: [{ text: "ERROR" }] });
  }

  // Step 2: Strip HTML to plain text
  const plainText = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 8000);

  // Step 3: Send to Claude
  const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{
        role: "user",
        content: `Extract the recipe from this webpage text and return ONLY a valid JSON object with no markdown, no backticks, and no explanation. If there is no recipe present, return only the word ERROR.

The JSON must have exactly these fields:
- name (string)
- description (1 sentence string)
- icon (string — must be exactly one of: "Chicken", "Beef & Lamb", "Seafood", "Vegetarian", "Rice & Grains", "Pasta & Noodles", "Bread & Wraps", "Potato & Root")
- cuisine (string)
- time (string, e.g. "30 mins")
- calories (number, per serving — estimate if not stated)
- servings (number)
- ingredients (array of objects: { "name": string, "amount": string, "source": "ai", "suggestions": [] })
- macros (object: { "protein": number, "carbs": number, "fat": number } — percentages adding to 100)
- method (array of step strings — cover all prep and cooking steps)

Webpage text:
${plainText}`,
      }],
    }),
  });

  const data = await anthropicRes.json();
  return res.status(200).json(data);
}
