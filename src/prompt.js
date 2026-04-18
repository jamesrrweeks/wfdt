export function buildPrompt(prefs) {
  const { season, proteins, carbs, veg, calories, macros, people, freeText, cuisine } = prefs;

  // What the user has explicitly selected (filtering out "Any")
  const selectedProteins = proteins?.filter(s => s !== "Any") ?? [];
  const selectedCarbs    = carbs?.filter(s => s !== "Any")    ?? [];
  const selectedVeg      = veg?.filter(s => s !== "Any")      ?? [];

  const hasProteins = selectedProteins.length > 0;
  const hasCarbs    = selectedCarbs.length > 0;
  const hasVeg      = selectedVeg.length > 0;

  // How obligated the AI is scales with how few items were selected
  const totalSelected = selectedProteins.length + selectedCarbs.length + selectedVeg.length;
  const obligationNote = totalSelected <= 3
    ? "The user has selected very few ingredients. Every selected ingredient is important — treat each one as essential and make sure it features prominently in every meal."
    : totalSelected <= 8
    ? "Use as many of the selected ingredients as reasonably fit each dish. Aim to cover all of them across the 3 meals."
    : "The user has provided a large pool of ingredients. Pull the best combination for each meal. You don't need to use all of them in every meal — just make great dishes from what's available.";

  // Constraint block — per category, independently applied  
  const proteinConstraint = hasProteins
    ? `PROTEIN — HARD CONSTRAINT: You must only use these proteins: ${selectedProteins.join(", ")}. Do not introduce any other protein. Do not substitute. These must appear in all 3 meals.`
    : `PROTEIN — You have full creative freedom. Choose proteins that suit the season, the cuisine, and the other ingredients. Do not invent expensive or hard-to-find proteins — stick to common NZ supermarket options.`;

  const carbConstraint = hasCarbs
    ? `CARBS — HARD CONSTRAINT: You must only use these carbs: ${selectedCarbs.join(", ")}. Do not introduce any other carb base. These must appear in all 3 meals.`
    : `CARBS — You have full creative freedom. Choose carbs that suit the dish. Prefer pantry staples.`;

  const vegConstraint = hasVeg
    ? `VEGETABLES — HARD CONSTRAINT: You must only use these vegetables: ${selectedVeg.join(", ")}. Do not introduce other fresh vegetables as a primary component. These must appear in all 3 meals.`
    : `VEGETABLES — You have full creative freedom. Choose vegetables that are in season in New Zealand right now (${season}). Prioritise what a NZ home cook would realistically find at the supermarket this time of year.`;

  const freeNote    = freeText?.trim() ? `\nExtra instructions from the user: ${freeText.trim()}` : "";
  const cuisineNote = cuisine && cuisine !== "Any" ? `\nCuisine style: ${cuisine}.` : "";

  // NZ pantry staples — the AI can use any of these freely without selection
  const pantryNote = `
NZ PANTRY STAPLES — you may use any of these freely as supporting ingredients:
Oils & fats: olive oil, sesame oil, butter, coconut oil
Salt, pepper & sugar: salt, black pepper, white sugar, brown sugar
Acids: white wine vinegar, rice wine vinegar, balsamic vinegar, lemon juice
Sauces & condiments: soy sauce, fish sauce, sweet chilli sauce, oyster sauce, tomato paste, Worcestershire sauce, honey, Dijon mustard
Dry goods: plain flour, cornflour, panko breadcrumbs
Tins & jars: tinned tomatoes, coconut milk, tinned chickpeas, tinned lentils
Aromatics: garlic, onion, ginger
Dried herbs & spices: cumin, paprika, turmeric, dried oregano, chilli flakes, ground coriander, curry powder, cinnamon
Stock: chicken stock, vegetable stock, beef stock
Universal perishables: eggs, milk, butter
Do NOT use ingredients outside this list as pantry items. If something isn't on this list and the user didn't select it, don't include it.`;

  // Household profile — reserved slot, empty for now
  const profileNote = `
HOUSEHOLD PROFILE:
- Dislikes: none
- Allergies: none
- Dietary needs: none`;

  return `You are a meal planning assistant for New Zealand home cooks. Generate exactly 3 meal ideas as a JSON array.

═══════════════════════════════════════
HARD CONSTRAINTS — READ BEFORE GENERATING
═══════════════════════════════════════

${proteinConstraint}

${carbConstraint}

${vegConstraint}

${obligationNote}

NEVER invent a perishable ingredient the user did not select. Proteins, fresh produce, and dairy (except universal perishables listed below) must come from the user's selections only. This rule overrides any creative decision.
${pantryNote}
${profileNote}
${freeNote}
${cuisineNote}

═══════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════

Each meal must include:
- name (string)
- description (1-2 sentence string)
- icon (string — the single most dominant ingredient or character of this specific dish. 
Must be exactly one of: "Chicken", "Beef & Lamb", "Seafood", "Vegetarian", 
"Rice & Grains", "Pasta & Noodles", "Bread & Wraps", "Potato & Root".
The dominant element could be the protein, the carb base, or even a seasonal vegetable 
if it defines the dish. Example: beef ragu on pasta = "Pasta & Noodles", grilled steak = 
"Beef & Lamb", chicken fried rice = "Rice & Grains", pumpkin soup = "Potato & Root".
IMPORTANT: All 3 meals must have different icons. If you find yourself repeating an icon, 
rethink that meal so it has a different dominant character.)
- cuisine (string — e.g. "Italian", "Japanese", "Mexican")
- time (string — e.g. "25 mins", "1 hr")
- calories (number — per serving)
- ingredients (array — scaled for ${people} people, see format below)
- macros (object — protein, carbs, fat as percentages adding to 100)
- method (array of 4–8 step strings) 
Method steps must cover all ingredient preparation — 
how to cut, peel, trim, or prep each ingredient before cooking.

INGREDIENTS FORMAT:
Each ingredient must be an object with exactly four fields:
{ "name": string, "amount": string, "source": "user" | "ai", "suggestions": string[] }

AMOUNT FIELD RULE: amount must contain a number and unit only. 
No preparation instructions. No descriptors. 
Correct: "1 kg", "6 cloves", "400 ml"
Wrong: "1 kg, cut into chunks", "6 cloves, whole", "400 ml, warmed"
All preparation instructions belong in the method steps.

SOURCE TAGGING RULES:
- "user" = the ingredient name directly matches something the user selected. Nothing else qualifies.
- "ai"   = everything else — pantry staples, universal perishables, seasonal veg chosen by you.

SUGGESTIONS RULES:
- 3–4 alternatives that could replace this ingredient in this specific dish
- Must make sense in context — not generic swaps
- Realistic for a NZ home cook
- For "user" ingredients: suggest realistic protein/carb/veg alternatives
- For "ai" ingredients: suggest pantry alternatives with similar flavour effect

Preferences:
- Servings: ${people}
- Target calories per serving: ${calories} kcal
- Macro split: ${macros?.protein}% protein, ${macros?.carbs}% carbs, ${macros?.fat}% fat

═══════════════════════════════════════
BEFORE RETURNING YOUR RESPONSE
═══════════════════════════════════════

Check each meal against these questions:
1. Does every meal include all hard-constrained ingredients?
2. Have I invented any perishable the user didn't select?
3. Are all pantry ingredients on the approved staples list?
4. Is every "source: user" tag a direct match to a user selection?
5. Do all 3 meals make sense as distinct, enjoyable weeknight dinners?
6. Do all 3 meals have different icons?


If any answer is no — fix it before returning.

Return ONLY a valid JSON array. No markdown, no explanation, no preamble.`;
}
