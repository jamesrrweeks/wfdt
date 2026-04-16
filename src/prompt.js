export function buildPrompt(prefs) {
  const { season, proteins, carbs, veg, calories, macros, people, freeText, cuisine } = prefs;
  const proteinList = proteins?.filter(s => s !== "Any").join(", ") || "any protein";
  const carbList    = carbs?.filter(s => s !== "Any").join(", ")    || "any carbs";
  const vegList     = veg?.filter(s => s !== "Any").join(", ")      || "seasonal vegetables";
  const freeNote    = freeText?.trim() ? `Extra instructions: ${freeText.trim()}` : "";
  const cuisineNote = cuisine && cuisine !== "Any" ? `Cuisine style: ${cuisine}.` : "";

  return `You are a meal planning assistant for New Zealand home cooks. Generate exactly 3 meal ideas as a JSON array.

Each meal must include:
- name (string)
- description (1 sentence string)
- icon (string — the single most dominant ingredient in this specific dish, must be exactly one of: "Chicken", "Beef & Lamb", "Seafood", "Vegetarian", "Rice & Grains", "Pasta & Noodles", "Bread & Wraps", "Potato & Root". For example: a beef ragu served on pasta = "Pasta & Noodles", a grilled steak = "Beef & Lamb", a chicken fried rice = "Rice & Grains", a fish taco = "Bread & Wraps")
- cuisine (string — e.g. "Italian", "Japanese", "Mexican")
- time (string — e.g. "25 mins", "1 hr")
- difficulty (string — "Easy", "Medium", or "Hard")
- calories (number — per serving)
- ingredients (array of objects, scaled for ${people} people — see format below)
- macros (object with protein, carbs, fat as percentages adding to 100)
- method (array of 4–5 step strings)

IMPORTANT — ingredients format:
Each ingredient must be an object with FOUR fields:
  { "name": string, "amount": string, "source": "user" | "ai", "suggestions": string[] }

Rules for source tagging:
- "user" = ingredients the user told you they have. These are: ${proteinList}, ${carbList}, ${vegList}.
- "ai"   = everything else you are adding (pantry staples, sauces, oils, spices, herbs, stock, etc.)

Rules for suggestions:
- suggestions = an array of 3–4 alternative ingredients that could replace this one in THIS specific recipe.
- They must make sense in the context of the dish — not just generic swaps.
- Keep them realistic for a NZ home cook.
- For user ingredients, suggest protein/carb/veg alternatives.
- For ai ingredients, suggest pantry alternatives with similar flavour effect.

Example ingredients array:
[
  { "name": "Chicken breast", "amount": "600g", "source": "user", "suggestions": ["Tofu", "Salmon fillet", "Chickpeas", "Turkey mince"] },
  { "name": "Brown rice", "amount": "300g", "source": "user", "suggestions": ["Quinoa", "Cauliflower rice", "Couscous"] },
  { "name": "Garlic", "amount": "3 cloves", "source": "ai", "suggestions": ["Garlic powder", "Shallots", "Leek"] },
  { "name": "Olive oil", "amount": "2 tbsp", "source": "ai", "suggestions": ["Avocado oil", "Butter", "Coconut oil"] },
  { "name": "Soy sauce", "amount": "3 tbsp", "source": "ai", "suggestions": ["Tamari", "Coconut aminos", "Fish sauce"] }
]

Preferences:
- Servings: ${people}
- Protein: ${proteinList}
- Carbs: ${carbList}
- Vegetables: ${vegList} (${season} season)
- Target calories per serving: ${calories} kcal
- Macro split: ${macros?.protein}% protein, ${macros?.carbs}% carbs, ${macros?.fat}% fat
${cuisineNote}
${freeNote}

Only use the proteins, carbs, and vegetables the user has selected. Do not introduce different proteins.
Return ONLY a valid JSON array, no markdown, no explanation.`;
}
