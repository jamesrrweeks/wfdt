export const config = { runtime: "edge" };

const PARSE_PROMPT = `You are a recipe parser. The user has uploaded a photo or screenshot of a recipe.

Extract the recipe and return ONLY a valid JSON object — no markdown, no backticks, no explanation.

The JSON must have exactly these fields:
{
  "name": string,
  "description": string (1 sentence),
  "icon": string (must be exactly one of: "Chicken", "Beef & Lamb", "Seafood", "Vegetarian", "Rice & Grains", "Pasta & Noodles", "Bread & Wraps", "Potato & Root"),
  "cuisine": string,
  "time": string (e.g. "30 mins"),
  "calories": number (per serving),
  "servings": number,
  "ingredients": array of objects with { "name": string, "amount": string, "source": "user", "suggestions": [] },
  "macros": { "protein": number, "carbs": number, "fat": number } (percentages adding to 100),
  "method": array of step strings
}

If you cannot find a recognisable recipe in the image, return only the word ERROR with no other text.`;

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const secret = req.headers.get("x-secret-token");
  if (secret !== process.env.VITE_API_SECRET_TOKEN) {
    return new Response("Unauthorised", { status: 401 });
  }

  let imageBase64, mediaType;
  try {
    const body = await req.json();
    imageBase64 = body.imageBase64;
    mediaType   = body.mediaType || "image/jpeg";
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  if (!imageBase64) {
    return new Response("Missing imageBase64", { status: 400 });
  }

  const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type":      "application/json",
      "x-api-key":         process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model:      "claude-sonnet-4-5",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: [
            {
              type:   "image",
              source: { type: "base64", media_type: mediaType, data: imageBase64 },
            },
            { type: "text", text: PARSE_PROMPT },
          ],
        },
      ],
    }),
  });

  const data = await anthropicRes.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
