export function buildPrompt(prefs) {
  const { season, proteins, carbs, veg, calories, macros, people, freeText, cuisine } = prefs;
  const proteinList = proteins?.filter(s=>s!=="Any").join(", ") || "any protein";
  const carbList    = carbs?.filter(s=>s!=="Any").join(", ")    || "any carbs";
  const vegList     = veg?.filter(s=>s!=="Any").join(", ")      || "seasonal vegetables";
  const freeNote    = freeText?.trim() ? `Extra instructions: ${freeText.trim()}` : "";
  const cuisineNote = cuisine && cuisine!=="Any" ? `Cuisine style: ${cuisine}.` : "";

  return `You are a meal planning assistant for New Zealand home cooks. Generate exactly 3 meal ideas as a JSON array.

Each meal must include:
- name (string)
- description (1 sentence string)
- icon (string — the single most dominant ingredient in this specific dish, must be exactly one of: "Chicken", "Beef & Lamb", "Seafood", "Vegetarian", "Rice & Grains", "Pasta & Noodles", "Bread & Wraps", "Potato & Root". For example: a beef ragu served on pasta = "Pasta & Noodles", a grilled steak = "Beef & Lamb", a chicken fried rice = "Rice & Grains", a fish taco = "Bread & Wraps")
- cuisine (string — e.g. "Italian", "Japanese", "Mexican")
- time (string — e.g. "25 mins", "1 hr")
- difficulty (string — "Easy", "Medium", or "Hard")
- calories (number — per serving)
- ingredients (array of strings, hero ingredients only, scaled for ${people} people)
- macros (object with protein, carbs, fat as percentages adding to 100)
- method (array of 4–5 step strings)

Preferences:
- Servings: ${people}
- Protein: ${proteinList}
- Carbs: ${carbList}
- Vegetables: ${vegList} (${season} season)
- Target calories per serving: ${calories} kcal
- Macro split: ${macros?.protein}% protein, ${macros?.carbs}% carbs, ${macros?.fat}% fat
${cuisineNote}
${freeNote}

Return ONLY a valid JSON array, no markdown, no explanation.`;
}
