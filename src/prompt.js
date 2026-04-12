export function buildPrompt(prefs) {
  const { season, proteins, carbs, veg, calories, macros, people, freeText, cuisine } = prefs;
  const proteinList = proteins?.filter(s=>s!=="Any").join(", ") || "any protein";
  const carbList    = carbs?.filter(s=>s!=="Any").join(", ")    || "any carbs";
  const vegList     = veg?.filter(s=>s!=="Any").join(", ")      || "seasonal vegetables";
  const freeNote    = freeText?.trim() ? `Extra instructions: ${freeText.trim()}` : "";
  const cuisineNote = cuisine && cuisine!=="Any" ? `Cuisine style: ${cuisine}.` : "";

  return `You are a meal planning assistant for New Zealand home cooks. Generate exactly 3 meal ideas as a JSON array.

Each meal must include: name, emoji, description (1 sentence), time, difficulty (Easy/Medium/Hard), calories (number), ingredients (array of strings, hero ingredients only scaled for ${people} people), macros ({protein, carbs, fat} as percentages adding to 100), method (array of 4-5 strings).

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
