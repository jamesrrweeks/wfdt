import { useState } from "react";

const COLORS = {
  cream: "#F0EDE6", dark: "#1C2B1E", lime: "#CDEA45",
  card: "#E8E4DB", muted: "#8A9B8C", border: "#C8C4BB",
};

// ─── SEASONAL VEG (NZ) ────────────────────────────────────────────────────────
const SEASONS = ["Summer", "Autumn", "Winter", "Spring"];
const SEASON_EMOJI = { Summer: "☀️", Autumn: "🍂", Winter: "❄️", Spring: "🌸" };

// Current NZ season (late March = Autumn)
const CURRENT_SEASON = "Autumn";

const VIBE_CHIPS     = ["Comfort Food", "Quick & Light", "Fakeaway", "Something Fresh", "Fancy It Up"];
const TIME_CHIPS     = ["15 mins", "30 mins", "45 mins+"];
const CUISINE_CHIPS  = ["Any", "Italian", "Asian", "Mexican", "Middle Eastern", "Indian", "Japanese", "French", "American", "Mediterranean"];
const PROTEIN_CATEGORIES = {
  "Chicken & Turkey": { emoji: "🍗", items: ["Chicken breast", "Chicken thighs", "Chicken mince", "Chicken drumsticks", "Chicken wings", "Turkey mince", "Turkey breast", "Duck", "Duck breast"] },
  "Fish & Seafood":   { emoji: "🐟", items: ["Salmon", "Salmon fillet", "White fish", "Snapper", "Tarakihi", "Blue cod", "Prawns", "Tuna (canned)", "Sardines", "Mussels", "Squid", "Scallops", "Crab", "Smoked salmon"] },
  "Beef & Lamb":      { emoji: "🥩", items: ["Beef mince", "Beef steak", "Beef strips", "Beef short ribs", "Beef brisket", "Lamb chops", "Lamb mince", "Lamb shoulder", "Lamb rack", "Lamb shank", "Sausages"] },
  "Pork":             { emoji: "🐷", items: ["Pork belly", "Pork mince", "Pork chops", "Pork shoulder", "Pork ribs", "Bacon", "Ham", "Chorizo", "Pancetta", "Prosciutto"] },
  "Veggie & Eggs":    { emoji: "🥚", items: ["Eggs", "Tofu", "Firm tofu", "Silken tofu", "Tempeh", "Chickpeas", "Lentils", "Red lentils", "Kidney beans", "Black beans", "Butter beans", "Edamame", "Halloumi", "Paneer", "Quorn mince"] },
};

const CARB_CATEGORIES = {
  "Pasta & Noodles":  { emoji: "🍝", items: ["Pasta", "Spaghetti", "Penne", "Fettuccine", "Gnocchi", "Orzo", "Noodles", "Udon noodles", "Soba noodles", "Rice noodles", "Glass noodles", "Couscous", "Polenta"] },
  "Rice & Grains":    { emoji: "🍚", items: ["Rice", "Basmati rice", "Jasmine rice", "Brown rice", "Arborio rice", "Quinoa", "Bulgur wheat", "Pearl barley", "Freekeh", "Farro", "Millet"] },
  "Bread & Wraps":    { emoji: "🫓", items: ["Sourdough", "White bread", "Wholegrain bread", "Flatbread", "Tortillas", "Corn tortillas", "Pita", "Naan", "Bao buns", "Burger buns", "Crumpets", "English muffins"] },
  "Potato & Root":    { emoji: "🥔", items: ["Potatoes", "Kumara", "Sweet potato", "Baby potatoes", "Parsnip", "Cassava", "Taro", "Yam"] },
  "No carbs":         { emoji: "🚫", items: ["No carbs"] },
};

const SEASONAL_VEG = {
  Summer:     ["Courgette", "Capsicum", "Tomatoes", "Cherry tomatoes", "Corn", "Cucumber", "Eggplant", "Beans", "Green beans", "Peas", "Spinach", "Lettuce", "Rocket", "Zucchini flowers", "Basil"],
  Autumn:     ["Pumpkin", "Butternut squash", "Kumara", "Carrot", "Beetroot", "Broccoli", "Broccolini", "Cauliflower", "Cabbage", "Silverbeet", "Kale", "Leek", "Mushrooms", "Shiitake", "Capsicum", "Feijoa", "Parsnip"],
  Winter:     ["Kumara", "Pumpkin", "Parsnip", "Carrot", "Beetroot", "Cauliflower", "Cabbage", "Savoy cabbage", "Kale", "Brussels sprouts", "Broccoli", "Leek", "Silverbeet", "Spinach", "Onion", "Spring onion", "Celeriac"],
  Spring:     ["Asparagus", "Peas", "Snap peas", "Broad beans", "Beans", "Spinach", "Baby spinach", "Lettuce", "Radish", "Spring onion", "Courgette", "Broccolini", "Fennel", "Artichoke"],
  "All year": ["Onion", "Red onion", "Garlic", "Celery", "Capsicum", "Spinach", "Baby spinach", "Broccoli", "Courgette", "Mushrooms", "Button mushrooms", "Silverbeet", "Carrot", "Tomatoes", "Cucumber", "Avocado", "Corn", "Pumpkin"],
};

const PANTRY_STAPLES = ["Olive oil", "Garlic", "Salt & pepper", "Onion", "Soy sauce", "Butter", "Lemon"];

// ─── TYPE-AHEAD DATABASE ──────────────────────────────────────────────────────
const TYPEAHEAD_INGREDIENTS = [
  "Anchovies","Apple","Apricots","Artichoke","Asparagus","Avocado","Baby spinach","Bacon",
  "Balsamic vinegar","Banana","Basil","Bay leaves","Bean sprouts","Black beans","Black olives",
  "Bok choy","Breadcrumbs","Broccolini","Brown sugar","Capers","Cardamom","Cashews",
  "Celery","Cheddar cheese","Chilli flakes","Chilli sauce","Chorizo","Cider vinegar",
  "Cinnamon","Coconut cream","Coconut milk","Coriander","Corn flour","Cream","Cream cheese",
  "Crème fraîche","Cumin","Curry paste","Curry powder","Dates","Dill","Dried apricots",
  "Dried cranberries","Dried oregano","Edamame","Fennel","Feta cheese","Fish sauce",
  "Five spice","Flour","Garam masala","Ginger","Greek yoghurt","Green beans","Green olives",
  "Harissa","Hoisin sauce","Honey","Jalapeño","Kale","Ketchup","Leeks","Lime","Lime leaves",
  "Mango","Maple syrup","Mayonnaise","Mint","Miso paste","Mixed herbs","Mozzarella",
  "Mushrooms","Mustard","Mustard seeds","Naan","Nutmeg","Oats","Oyster sauce","Paprika",
  "Parmesan","Parsley","Passata","Peanut butter","Peanuts","Pecans","Pesto","Pine nuts",
  "Pinenuts","Pomegranate","Pomegranate molasses","Pumpkin seeds","Red cabbage","Red wine",
  "Red wine vinegar","Rice wine vinegar","Ricotta","Rocket","Rosemary","Sesame oil",
  "Sesame seeds","Shallots","Smoked paprika","Sour cream","Spring onions","Star anise",
  "Stock cubes","Chicken stock","Beef stock","Vegetable stock","Sunflower seeds","Sweet chilli",
  "Tahini","Tamarind","Thyme","Tinned tomatoes","Tomato paste","Turmeric","Vanilla",
  "Walnuts","White wine","White wine vinegar","Worcestershire sauce","Yoghurt","Za'atar",
  "Sumac","Dukkah","Preserved lemon","Rose water","Pomegranate seeds","Chipotle paste",
  "Sriracha","Nam pla","Ponzu","Mirin","Sake","Shaoxing wine","Dried chilli","Chilli powder",
  "Smoked salt","Sea salt flakes","Black pepper","White pepper","Mixed spice","Allspice",
  "Cloves","Saffron","Dried thyme","Dried rosemary","Dried basil","Italian herbs","Ras el hanout",
  "Baharat","Berbere","Harissa paste","Sun-dried tomatoes","Caramelised onions","Roasted capsicum",
];

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_MEALS = [
  {
    id: 1, name: "Spaghetti Carbonara", emoji: "🍝",
    description: "Silky, indulgent pasta with crispy pancetta and a rich egg sauce.",
    time: "25 mins", difficulty: "Easy", calories: 520,
    ingredients: ["200g spaghetti", "100g pancetta", "2 large eggs + 1 yolk", "50g pecorino"],
    pantryUsed: ["2 cloves garlic", "1 tsp salt & pepper", "1 tbsp olive oil"],
    macros: { protein: 28, carbs: 42, fat: 30 },
    method: ["Boil spaghetti in salted water until al dente. Reserve a mug of pasta water.", "Fry pancetta until crispy. Add garlic for the last minute, remove from heat.", "Whisk eggs, yolk, and most of the cheese. Season generously with black pepper.", "Toss hot pasta with pancetta off the heat. Add egg mix and toss fast with pasta water until silky.", "Serve with remaining cheese and a crack of pepper."],
  },
  {
    id: 2, name: "Chicken Stir Fry", emoji: "🥢",
    description: "Fast, saucy and punchy — glossy chicken with crisp veg over steamed rice.",
    time: "20 mins", difficulty: "Easy", calories: 410,
    ingredients: ["2 chicken breasts, sliced", "Broccoli & capsicum", "Rice to serve"],
    pantryUsed: ["3 tbsp soy sauce", "2 cloves garlic", "1 tbsp olive oil", "1 tsp salt & pepper"],
    macros: { protein: 38, carbs: 35, fat: 27 },
    method: ["Mix soy sauce, garlic and a splash of sesame oil in a bowl.", "Heat a wok until very hot. Cook chicken in batches until golden.", "Add broccoli, stir fry 3 mins. Add capsicum and toss.", "Pour over sauce, cook 1–2 mins until coated and glossy.", "Serve over rice."],
  },
  {
    id: 3, name: "Halloumi Wraps", emoji: "🫓",
    description: "Golden, squeaky halloumi with creamy avocado and a chilli kick.",
    time: "15 mins", difficulty: "Easy", calories: 480,
    ingredients: ["250g halloumi, sliced", "4 flour tortillas", "1 avocado", "Cherry tomatoes", "Mixed leaves"],
    pantryUsed: ["1 tbsp olive oil", "½ lemon, juiced", "1 tsp salt & pepper"],
    macros: { protein: 22, carbs: 38, fat: 40 },
    method: ["Slice halloumi into 1cm planks. Heat a dry griddle until hot.", "Cook halloumi 2 mins each side until golden.", "Warm tortillas in a dry pan or microwave.", "Mash avocado with lemon and salt. Spread over each wrap.", "Layer leaves, tomatoes, halloumi. Fold and serve."],
  },
];

// ─── PROMPT BUILDER ───────────────────────────────────────────────────────────
function buildPrompt(prefs) {
  const proteins = prefs.proteins.includes("Any") ? "any protein" : prefs.proteins.join(", ");
  const carbs    = prefs.carbs.includes("Any") ? "any carbs" : prefs.carbs.join(", ");
  const veg      = prefs.veg.includes("Any") ? `any seasonal NZ ${prefs.season} vegetables` : prefs.veg.join(", ");
  const cuisineNote  = prefs.cuisine && prefs.cuisine !== "Any" ? `- Cuisine style: ${prefs.cuisine} — all 3 meals must be ${prefs.cuisine} in style` : "";
  const macroNote    = prefs.macros ? `- Macro target: aim for roughly ${prefs.macros.protein}% protein, ${prefs.macros.carbs}% carbs, ${prefs.macros.fat}% fat per serving` : "";
  const freeTextNote = prefs.freeText && prefs.freeText.trim() ? `- Extra instructions from the user: ${prefs.freeText.trim()}` : "";

  return `You are a meal planning assistant for New Zealand home cooks. It is ${prefs.season} in NZ.

The user wants dinner tonight:
- Protein: ${proteins}
- Carbs: ${carbs}
- Vegetables: ${veg}
- Target calories per serving: around ${prefs.calories} kcal
- Servings: ${prefs.people}
- Season: ${prefs.season} in New Zealand — reflect this in the meal style and ingredients
${cuisineNote}
${macroNote}
${freeTextNote}

Assume the user has these pantry staples available: olive oil, garlic, salt, pepper, onion, soy sauce, butter, lemon.

Generate exactly 3 different weeknight dinner ideas.

Respond ONLY with a valid JSON array. No explanation, no markdown, no preamble:
[
  {
    "name": "Meal name",
    "emoji": "single relevant emoji",
    "description": "One punchy sentence selling the dish — flavour, texture, appeal. 10-15 words.",
    "time": "X mins",
    "difficulty": "Easy",
    "calories": 500,
    "ingredients": ["quantity + ingredient (hero ingredients only, not pantry staples)"],
    "pantryUsed": ["2 tbsp olive oil", "3 cloves garlic", "1 tsp salt"],
    "macros": { "protein": 30, "carbs": 40, "fat": 30 },
    "method": ["Step one.", "Step two.", "Step three.", "Step four.", "Step five."]
  }
]

Rules:
- ingredients: 4–6 hero items only, scaled to ${prefs.people} serving(s). Do NOT include pantry staples here.
- pantryUsed: list which pantry staples this recipe uses WITH quantities e.g. "2 tbsp olive oil", "3 cloves garlic", "1 tsp salt & pepper". Scale to ${prefs.people} serving(s).
- method: 4–5 steps, written assuming pantry staples are available
- Make all 3 meals distinct in style`;
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Chip({ label, selected, onClick, accent, dim }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 16px", borderRadius: "100px", flexShrink: 0,
      border: `1.5px solid ${selected ? "transparent" : COLORS.border}`,
      background: selected ? (accent ? COLORS.lime : COLORS.dark) : "transparent",
      color: selected ? (accent ? COLORS.dark : COLORS.cream) : dim ? COLORS.muted : COLORS.dark,
      fontSize: "13px", fontFamily: "'DM Sans', sans-serif",
      fontWeight: selected ? "600" : "400", cursor: "pointer",
      whiteSpace: "nowrap", transition: "all 0.15s ease", opacity: dim ? 0.6 : 1,
    }}>
      {label}
    </button>
  );
}

function Stepper({ value, onChange }) {
  const btn = (label, action) => (
    <button onClick={action} style={{
      width: 36, height: 36, borderRadius: "50%", border: `1.5px solid ${COLORS.border}`,
      background: "transparent", fontSize: "18px", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.dark,
    }}>{label}</button>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      {btn("−", () => onChange(Math.max(1, value - 1)))}
      <span style={{ fontSize: "18px", fontWeight: "600", minWidth: "20px", textAlign: "center", color: COLORS.dark }}>{value}</span>
      {btn("+", () => onChange(Math.min(8, value + 1)))}
    </div>
  );
}

function CalorieSlider({ value, onChange }) {
  const min = 200, max = 900;
  const pct = ((value - min) / (max - min)) * 100;
  const label = value <= 350 ? "Light" : value <= 550 ? "Medium" : value <= 750 ? "Hearty" : "Feast";
  const labelColor = value <= 350 ? "#6BAE8A" : value <= 550 ? COLORS.dark : value <= 750 ? "#C47B2B" : "#B94040";

  const step = (dir) => {
    const next = value + dir * 25;
    onChange(Math.min(max, Math.max(min, next)));
  };

  const stepBtn = (dir, symbol) => (
    <button onClick={() => step(dir)} style={{
      width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
      border: `1.5px solid ${COLORS.border}`, background: "transparent",
      fontSize: "16px", cursor: "pointer", color: COLORS.dark,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", fontWeight: "500",
    }}>{symbol}</button>
  );

  return (
    <div>
      {/* Value + label row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "14px" }}>
        <div>
          <span style={{ fontSize: "32px", fontWeight: "700", color: COLORS.dark, fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>{value}</span>
          <span style={{ fontSize: "14px", color: COLORS.muted, fontFamily: "'DM Sans', sans-serif", marginLeft: "4px" }}>kcal</span>
        </div>
        <span style={{ fontSize: "13px", fontWeight: "700", color: labelColor, fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
      </div>

      {/* Slider track */}
      <div style={{ position: "relative", height: "4px", borderRadius: "4px", background: COLORS.border, marginBottom: "12px" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: COLORS.dark, borderRadius: "4px" }} />
        <input type="range" min={min} max={max} step={25} value={value} onChange={e => onChange(Number(e.target.value))}
          style={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)", width: "100%", opacity: 0, cursor: "pointer", height: "28px", margin: 0 }} />
        <div style={{ position: "absolute", top: "50%", left: `${pct}%`, transform: "translate(-50%, -50%)", width: "22px", height: "22px", borderRadius: "50%", background: COLORS.dark, border: `3px solid ${COLORS.cream}`, boxShadow: "0 1px 4px rgba(0,0,0,0.2)", pointerEvents: "none" }} />
      </div>

      {/* Stepper row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "11px", color: COLORS.muted, fontFamily: "'DM Sans', sans-serif" }}>200 kcal</span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
            <button onClick={() => step(-1)} style={{
              width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
              border: `1.5px solid ${COLORS.border}`, background: "transparent",
              fontSize: "18px", cursor: "pointer", color: COLORS.dark,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>−</button>
            <span style={{ fontSize: "9px", color: COLORS.muted, fontFamily: "'DM Sans', sans-serif" }}>25 kcal</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
            <button onClick={() => step(+1)} style={{
              width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
              border: `1.5px solid ${COLORS.border}`, background: "transparent",
              fontSize: "18px", cursor: "pointer", color: COLORS.dark,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>+</button>
            <span style={{ fontSize: "9px", color: COLORS.muted, fontFamily: "'DM Sans', sans-serif" }}>25 kcal</span>
          </div>
        </div>
        <span style={{ fontSize: "11px", color: COLORS.muted, fontFamily: "'DM Sans', sans-serif" }}>900 kcal</span>
      </div>
    </div>
  );
}

// ─── MACRO BAR (shared across screens) ───────────────────────────────────────
// Pass calories prop to show grams; omit for percentage display
function MacroBar({ protein, carbs, fat, size = "sm", calories }) {
  const h         = size === "lg" ? "6px" : "4px";
  const fontSize  = size === "lg" ? "12px" : "11px";
  const showGrams = !!calories;

  const toG = (pct, kcalPerG) => Math.round((pct / 100) * calories / kcalPerG);
  const labels = showGrams
    ? [["Protein", toG(protein, 4), "g", "#7BB8F0"], ["Carbs", toG(carbs, 4), "g", COLORS.lime], ["Fat", toG(fat, 9), "g", "#F0A87B"]]
    : [["P", protein, "%", "#7BB8F0"], ["C", carbs, "%", COLORS.lime], ["F", fat, "%", "#F0A87B"]];

  return (
    <div>
      <div style={{ display: "flex", height: h, borderRadius: "4px", overflow: "hidden", gap: "1px" }}>
        <div style={{ width: `${protein}%`, background: "#7BB8F0" }} />
        <div style={{ width: `${carbs}%`,   background: COLORS.lime }} />
        <div style={{ width: `${fat}%`,     background: "#F0A87B" }} />
      </div>
      <div style={{ display: "flex", gap: showGrams ? "16px" : "12px", marginTop: "6px" }}>
        {labels.map(([l, v, unit, c]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: c, flexShrink: 0 }} />
            <span style={{ fontSize, color: COLORS.muted, fontFamily: "'DM Sans', sans-serif" }}>
              {l} <strong style={{ color: COLORS.dark }}>{v}{unit}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MACRO PRESETS ────────────────────────────────────────────────────────────
const MACRO_PRESETS = [
  { name: "Balanced",     protein: 30, carbs: 40, fat: 30 },
  { name: "High Protein", protein: 45, carbs: 30, fat: 25 },
  { name: "Low Carb",     protein: 35, carbs: 20, fat: 45 },
  { name: "Keto",         protein: 25, carbs: 5,  fat: 70 },
  { name: "High Carb",    protein: 20, carbs: 55, fat: 25 },
  { name: "Low Fat",      protein: 40, carbs: 45, fat: 15 },
];

// ─── MACRO SELECTOR (always on, pills + steppers) ─────────────────────────────
const DEFAULT_MACROS = { protein: 30, carbs: 40, fat: 30 };

function MacroSelector({ value, onChange }) {
  const macros = value || DEFAULT_MACROS;

  const adjust = (key, dir) => {
    const delta  = dir * 5;
    const newVal = Math.min(90, Math.max(5, macros[key] + delta));
    const diff   = newVal - macros[key];
    if (diff === 0) return;

    const others     = Object.keys(macros).filter(k => k !== key);
    const otherTotal = others.reduce((s, k) => s + macros[k], 0);
    let updated      = { ...macros, [key]: newVal };

    if (otherTotal > 0) {
      others.forEach(k => {
        updated[k] = Math.max(5, Math.round(macros[k] - diff * (macros[k] / otherTotal)));
      });
    }

    const total  = Object.values(updated).reduce((s, v) => s + v, 0);
    const delta2 = 100 - total;
    if (delta2 !== 0) {
      const fixKey = others.find(k => updated[k] + delta2 >= 5) || others[0];
      updated[fixKey] = Math.max(5, updated[fixKey] + delta2);
    }

    onChange(updated);
  };

  const MacroStepper = ({ label, k, color }) => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
        <span style={{ fontSize: "11px", fontWeight: "700", color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
      </div>
      <span style={{ fontSize: "22px", fontWeight: "700", color: COLORS.dark, fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>
        {macros[k]}%
      </span>
      <div style={{ display: "flex", gap: "6px" }}>
        <button onClick={() => adjust(k, -1)} style={{ width: 28, height: 28, borderRadius: "50%", border: `1.5px solid ${COLORS.border}`, background: "transparent", fontSize: "16px", cursor: "pointer", color: COLORS.dark, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
        <button onClick={() => adjust(k, +1)} style={{ width: 28, height: 28, borderRadius: "50%", border: `1.5px solid ${COLORS.border}`, background: "transparent", fontSize: "16px", cursor: "pointer", color: COLORS.dark, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
      </div>
    </div>
  );

  return (
    <div>
      <label style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", color: COLORS.muted, textTransform: "uppercase", display: "block", marginBottom: "12px", fontFamily: "'DM Sans', sans-serif" }}>
        ⚖️ Macro ratio
      </label>

      {/* Preset pills */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px" }}>
        {MACRO_PRESETS.map(p => {
          const isMatch = macros.protein === p.protein && macros.carbs === p.carbs && macros.fat === p.fat;
          return (
            <button key={p.name} onClick={() => onChange({ protein: p.protein, carbs: p.carbs, fat: p.fat })}
              style={{
                padding: "7px 14px", borderRadius: "100px", flexShrink: 0,
                border: `1.5px solid ${isMatch ? COLORS.dark : COLORS.border}`,
                background: isMatch ? COLORS.dark : "transparent",
                color: isMatch ? COLORS.cream : COLORS.dark,
                fontSize: "13px", fontFamily: "'DM Sans', sans-serif",
                fontWeight: isMatch ? "600" : "400", cursor: "pointer",
                whiteSpace: "nowrap", transition: "all 0.15s ease",
              }}>
              {p.name}
            </button>
          );
        })}
      </div>

      {/* Steppers + live bar */}
      <div style={{ background: COLORS.card, borderRadius: "16px", padding: "16px" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <MacroStepper label="Protein" k="protein" color="#7BB8F0" />
          <div style={{ width: "1px", background: COLORS.border, flexShrink: 0 }} />
          <MacroStepper label="Carbs" k="carbs" color={COLORS.lime} />
          <div style={{ width: "1px", background: COLORS.border, flexShrink: 0 }} />
          <MacroStepper label="Fat" k="fat" color="#F0A87B" />
        </div>
        <MacroBar protein={macros.protein} carbs={macros.carbs} fat={macros.fat} />
      </div>
    </div>
  );
}

// ─── TYPE-AHEAD INPUT (shared) ────────────────────────────────────────────────
function TypeAheadInput({ placeholder, selectedItems, onAdd }) {
  const [val, setVal] = useState("");

  const confirm = (item) => {
    const v = (item || val).trim();
    if (!v) return;
    onAdd(v);
    setVal("");
  };

  const suggestions = val.trim().length >= 2
    ? TYPEAHEAD_INGREDIENTS.filter(s => s.toLowerCase().includes(val.toLowerCase()) && !selectedItems.includes(s)).slice(0, 5)
    : [];

  return (
    <div style={{ position: "relative", marginTop: "12px", paddingTop: "12px", borderTop: `1px solid ${COLORS.border}` }}>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <input
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") confirm(); if (e.key === "Escape") setVal(""); }}
          placeholder={placeholder}
          style={{ flex: 1, padding: "8px 14px", borderRadius: "100px", border: `1.5px solid ${COLORS.border}`, background: "transparent", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", color: COLORS.dark, outline: "none" }}
        />
        {val.trim() && (
          <button onClick={() => confirm()} style={{ width: 30, height: 30, borderRadius: "50%", background: COLORS.dark, border: "none", color: COLORS.lime, fontSize: "14px", cursor: "pointer", flexShrink: 0 }}>✓</button>
        )}
      </div>
      {suggestions.length > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: "100%", zIndex: 20, background: COLORS.cream, border: `1.5px solid ${COLORS.border}`, borderRadius: "14px", marginTop: "4px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
          {suggestions.map(s => (
            <button key={s} onClick={() => confirm(s)}
              style={{ width: "100%", padding: "9px 14px", background: "none", border: "none", borderBottom: `1px solid ${COLORS.border}`, cursor: "pointer", textAlign: "left", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", color: COLORS.dark }}
              onMouseEnter={e => e.currentTarget.style.background = COLORS.card}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >{s}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── CATEGORY CHIP SELECTOR (protein + carbs) ─────────────────────────────────
// Same visual pattern as VegSelector — category tabs on top, chips below
function CategoryChipSelector({ icon, label, categories, selected, onChange }) {
  const catNames = Object.keys(categories);
  const [activeTab, setActiveTab] = useState(catNames[0]);
  const selectedItems = selected.filter(s => s !== "Any");

  const toggle = (item) => {
    if (item === "No carbs") { onChange(["No carbs"]); return; }
    const without = selectedItems.filter(s => s !== "No carbs" && s !== "Any");
    const next = without.includes(item) ? without.filter(s => s !== item) : [...without, item];
    onChange(next.length === 0 ? ["Any"] : next);
  };

  const currentItems = categories[activeTab]?.items || [];

  return (
    <div>
      {/* Section label */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "12px" }}>
        <label style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", color: COLORS.muted, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
          {icon} {label}
        </label>
        {selectedItems.length > 0 && (
          <button onClick={() => onChange(["Any"])} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "11px", color: COLORS.muted, fontFamily: "'DM Sans', sans-serif", textDecoration: "underline" }}>
            Clear
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "14px" }}>
        {catNames.map(cat => {
          const isActive = activeTab === cat;
          const { emoji } = categories[cat];
          return (
            <button key={cat} onClick={() => setActiveTab(cat)} style={{
              padding: "10px 12px", borderRadius: "14px", flexShrink: 0,
              border: `1.5px solid ${isActive ? "transparent" : COLORS.border}`,
              background: isActive ? COLORS.dark : COLORS.card,
              color: isActive ? COLORS.cream : COLORS.muted,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: isActive ? "700" : "500", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
              transition: "all 0.15s ease",
              minWidth: "60px",
            }}>
              <span style={{ fontSize: "18px" }}>{emoji}</span>
              <span style={{ fontSize: "10px", letterSpacing: "0.02em", textAlign: "center", lineHeight: 1.2 }}>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Item chips — subordinate style inside bordered container */}
      <div style={{ padding: "14px", borderRadius: "16px", border: `1.5px solid ${COLORS.border}`, background: COLORS.cream }}>
        <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", color: COLORS.muted, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: "10px" }}>
          {activeTab}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
          {currentItems.map(item => {
            const isSelected = selectedItems.includes(item);
            return (
              <button key={item} onClick={() => toggle(item)} style={{
                padding: "6px 12px", borderRadius: "100px",
                border: `1.5px solid ${isSelected ? "transparent" : COLORS.border}`,
                background: isSelected ? COLORS.lime : "transparent",
                color: COLORS.dark,
                fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
                fontWeight: isSelected ? "700" : "400",
                cursor: "pointer", transition: "all 0.12s ease",
              }}>
                {item}
              </button>
            );
          })}
        </div>
        <TypeAheadInput
          placeholder={`Other ${activeTab.toLowerCase()}...`}
          selectedItems={selectedItems}
          onAdd={(v) => { const without = selectedItems.filter(s => s !== "Any" && s !== "No carbs"); onChange([...without, v]); }}
        />
      </div>

      {/* Selected summary */}
      {selectedItems.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
          {selectedItems.map(item => (
            <button key={item} onClick={() => toggle(item)} style={{
              padding: "5px 11px", borderRadius: "100px", border: "none",
              background: COLORS.dark, color: COLORS.cream,
              fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
              fontWeight: "600", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "5px",
            }}>
              {item} <span style={{ opacity: 0.5, fontSize: "10px" }}>✕</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── VEG SELECTOR ─────────────────────────────────────────────────────────────
function VegSelector({ season, onSeasonChange, selected, onChange }) {
  const [activeTab, setActiveTab] = useState("All year");
  const selectedItems = selected.filter(s => s !== "Any");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab !== "All year") onSeasonChange(tab);
  };

  const toggleVeg = (v) => {
    const next = selectedItems.includes(v)
      ? selectedItems.filter(s => s !== v)
      : [...selectedItems, v];
    onChange(next.length === 0 ? ["Any"] : next);
  };

  // All year first, then seasons
  const tabs = ["All year", ...SEASONS];
  const currentVeg = SEASONAL_VEG[activeTab] || [];

  return (
    <div>
      {/* Section label */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "12px" }}>
        <label style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", color: COLORS.muted, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
          🥦 Vegetables
        </label>
        {selectedItems.length > 0 && (
          <button onClick={() => onChange(["Any"])} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "11px", color: COLORS.muted, fontFamily: "'DM Sans', sans-serif", textDecoration: "underline" }}>
            Clear
          </button>
        )}
      </div>

      {/* Season tabs — styled as category headers, larger and more prominent */}
      <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "14px" }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          const emoji = tab === "All year" ? "🌿" : SEASON_EMOJI[tab];
          return (
            <button key={tab} onClick={() => handleTabChange(tab)} style={{
              padding: "10px 16px", borderRadius: "14px", flexShrink: 0,
              border: `1.5px solid ${isActive ? "transparent" : COLORS.border}`,
              background: isActive ? COLORS.dark : COLORS.card,
              color: isActive ? COLORS.cream : COLORS.muted,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: isActive ? "700" : "500", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
              transition: "all 0.15s ease",
              minWidth: "64px",
            }}>
              <span style={{ fontSize: "18px" }}>{emoji}</span>
              <span style={{ fontSize: "11px", letterSpacing: "0.03em" }}>{tab}</span>
            </button>
          );
        })}
      </div>

      {/* Veg chips — smaller, subordinate style to show they belong to the season above */}
      <div style={{ padding: "14px", borderRadius: "16px", border: `1.5px solid ${COLORS.border}`, background: COLORS.cream }}>
        <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", color: COLORS.muted, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: "10px" }}>
          {activeTab === "All year" ? "Available any time" : `In season · ${activeTab}`}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
          {currentVeg.map(v => {
            const isSelected = selectedItems.includes(v);
            return (
              <button key={v} onClick={() => toggleVeg(v)} style={{
                padding: "6px 12px", borderRadius: "100px",
                border: `1.5px solid ${isSelected ? "transparent" : COLORS.border}`,
                background: isSelected ? COLORS.lime : "transparent",
                color: COLORS.dark,
                fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
                fontWeight: isSelected ? "700" : "400",
                cursor: "pointer", transition: "all 0.12s ease",
              }}>
                {v}
              </button>
            );
          })}
        </div>
        <TypeAheadInput
          placeholder="Other vegetable..."
          selectedItems={selectedItems}
          onAdd={(v) => { const without = selectedItems.filter(s => s !== "Any"); onChange([...without, v]); }}
        />
      </div>

      {/* Selected summary */}
      {selectedItems.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
          {selectedItems.map(item => (
            <button key={item} onClick={() => toggleVeg(item)} style={{
              padding: "5px 11px", borderRadius: "100px", border: "none",
              background: COLORS.dark, color: COLORS.cream,
              fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
              fontWeight: "600", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "5px",
            }}>
              {item} <span style={{ opacity: 0.5, fontSize: "10px" }}>✕</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SCREEN 1: INPUT ──────────────────────────────────────────────────────────
function InputScreen({ onGenerate, isLoading }) {
  const [season, setSeason]     = useState(CURRENT_SEASON);
  const [proteins, setProteins] = useState(["Any"]);
  const [carbs, setCarbs]       = useState(["Any"]);
  const [veg, setVeg]           = useState(["Any"]);
  const [calories, setCalories] = useState(500);
  const [macros, setMacros]     = useState(DEFAULT_MACROS);
  const [people, setPeople]     = useState(2);
  const [freeText, setFreeText] = useState("");
  const [freeTextOpen, setFreeTextOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Reset veg selection when season changes
  const handleSeasonChange = (s) => {
    setSeason(s);
    setVeg(["Any"]);
  };

  const summary = () => {
    const parts = [];
    if (!proteins.includes("Any")) parts.push(proteins.join(", "));
    if (!carbs.includes("Any"))    parts.push(carbs.join(", "));
    if (!veg.includes("Any"))      parts.push(veg.join(", "));
    return parts.length ? parts.join(" · ") : null;
  };

  return (
    <div style={{ padding: "0 0 110px 0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        input:focus { outline: none; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "56px 24px 24px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", background: COLORS.lime, borderRadius: "100px", padding: "6px 14px", marginBottom: "18px" }}>
          <span style={{ fontSize: "13px", fontWeight: "600", color: COLORS.dark, fontFamily: "'DM Sans', sans-serif" }}>✦ AI Powered · NZ Seasonal</span>
        </div>
        <h1 style={{ fontSize: "36px", lineHeight: "1.1", color: COLORS.dark, fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: "400", margin: 0 }}>
          What's for<br />dinner tonight?
        </h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

        {/* Servings — top field, always visible */}
        <div style={{ padding: "0 24px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", color: COLORS.dark, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", borderTop: `1px solid ${COLORS.border}`, paddingTop: "20px", marginBottom: "16px" }}>
            👤 How many servings?
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Stepper value={people} onChange={setPeople} />
            <span style={{ fontSize: "13px", color: COLORS.muted, fontFamily: "'DM Sans', sans-serif" }}>
              {people === 1 ? "Just me" : people === 2 ? "Two of us" : `${people} people`}
            </span>
          </div>
        </div>

        {/* Ingredients */}
        <div style={{ padding: "0 24px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", color: COLORS.dark, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", borderTop: `1px solid ${COLORS.border}`, paddingTop: "20px", marginBottom: "24px" }}>
            What's in the fridge?
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <CategoryChipSelector
              icon="🥩" label="Protein"
              categories={PROTEIN_CATEGORIES}
              selected={proteins} onChange={setProteins}
            />
            <CategoryChipSelector
              icon="🌾" label="Carbs"
              categories={CARB_CATEGORIES}
              selected={carbs} onChange={setCarbs}
            />
            <VegSelector season={season} onSeasonChange={handleSeasonChange} selected={veg} onChange={setVeg} />
          </div>
        </div>

        {/* Pantry staples note */}
        <div style={{ padding: "0 24px" }}>
          <div style={{ background: COLORS.card, borderRadius: "14px", padding: "12px 16px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "16px", flexShrink: 0 }}>🧂</span>
            <div>
              <div style={{ fontSize: "12px", fontWeight: "700", color: COLORS.dark, fontFamily: "'DM Sans', sans-serif", marginBottom: "2px" }}>Pantry staples assumed</div>
              <div style={{ fontSize: "12px", color: COLORS.muted, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
                Recipes will use: {PANTRY_STAPLES.join(", ")}. You can remove any from the recipe if you don't have it.
              </div>
            </div>
          </div>
        </div>

        {/* Selection summary */}
        {summary() && (
          <div style={{ padding: "0 24px" }}>
            <div style={{ background: COLORS.dark, borderRadius: "16px", padding: "12px 16px", display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "13px", color: COLORS.lime, fontWeight: "600", fontFamily: "'DM Sans', sans-serif" }}>✦</span>
              <span style={{ fontSize: "13px", color: COLORS.cream, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>{summary()}</span>
            </div>
          </div>
        )}

        {/* Free text — anything else */}
        <div style={{ padding: "0 24px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", color: COLORS.dark, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", borderTop: `1px solid ${COLORS.border}`, paddingTop: "20px", marginBottom: "12px" }}>
            Anything else?
          </div>
          {freeTextOpen ? (
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <textarea
                autoFocus
                value={freeText}
                onChange={e => setFreeText(e.target.value)}
                placeholder="e.g. nothing spicy, use up leftover coconut milk, quick and easy..."
                rows={3}
                style={{
                  flex: 1, padding: "12px 14px", borderRadius: "16px",
                  border: `1.5px solid ${COLORS.dark}`, background: COLORS.cream,
                  fontSize: "13px", fontFamily: "'DM Sans', sans-serif",
                  color: COLORS.dark, resize: "none", outline: "none", lineHeight: 1.5,
                }}
              />
              <button
                onClick={() => { setFreeText(""); setFreeTextOpen(false); }}
                style={{ width: 32, height: 32, borderRadius: "50%", background: "transparent", border: `1.5px solid ${COLORS.border}`, color: COLORS.muted, fontSize: "13px", cursor: "pointer", flexShrink: 0, marginTop: "4px" }}
              >✕</button>
            </div>
          ) : (
            <button
              onClick={() => setFreeTextOpen(true)}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: "100px",
                border: `1.5px dashed ${COLORS.border}`, background: "transparent",
                color: COLORS.muted, fontSize: "13px", fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer", textAlign: "left",
              }}
            >
              + e.g. nothing spicy, use up leftovers...
            </button>
          )}
        </div>

        {/* Calories + Macros — optional accordion */}
        <div style={{ padding: "0 24px" }}>
          <button
            onClick={() => setDetailsOpen(o => !o)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "none", border: "none", cursor: "pointer",
              borderTop: `1px solid ${COLORS.border}`, paddingTop: "20px", paddingBottom: detailsOpen ? "20px" : "0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em", color: COLORS.dark, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
                🔥 Calories & macros
              </span>
              {!detailsOpen && (
                <span style={{ fontSize: "12px", color: COLORS.muted, fontFamily: "'DM Sans', sans-serif" }}>
                  {calories} kcal · {macros.protein}P / {macros.carbs}C / {macros.fat}F
                </span>
              )}
            </div>
            <span style={{ fontSize: "12px", color: COLORS.muted, transition: "transform 0.2s", display: "inline-block", transform: detailsOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
          </button>

          {detailsOpen && (
            <div style={{ display: "flex", flexDirection: "column", gap: "28px", paddingBottom: "8px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", color: COLORS.muted, textTransform: "uppercase", display: "block", marginBottom: "14px", fontFamily: "'DM Sans', sans-serif" }}>
                  Calories per serving
                </label>
                <CalorieSlider value={calories} onChange={setCalories} />
              </div>
              <MacroSelector value={macros} onChange={setMacros} />
            </div>
          )}
        </div>
      </div>

      {/* Generate button */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "390px", padding: "16px 24px 32px", background: `linear-gradient(transparent, ${COLORS.cream} 40%)`, zIndex: 10 }}>
        <button
          onClick={() => onGenerate({ season, proteins, carbs, veg, calories, macros, people, freeText })}
          disabled={isLoading}
          style={{
            width: "100%", padding: "18px", borderRadius: "100px", border: "none",
            background: isLoading ? COLORS.muted : COLORS.lime,
            color: isLoading ? COLORS.cream : COLORS.dark, fontSize: "16px", fontWeight: "600",
            fontFamily: "'DM Sans', sans-serif",
            cursor: isLoading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
          }}
        >
          {isLoading
            ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>✦</span>Thinking up ideas...</>
            : "✦ Generate my dinner"
          }
        </button>
      </div>
    </div>
  );
}

// ─── MEAL CARD ────────────────────────────────────────────────────────────────
function MealCard({ meal, featured, onSelect }) {
  return (
    <div style={{
      background: COLORS.card,
      borderRadius: "24px", overflow: "hidden",
      border: `1.5px solid ${featured ? COLORS.lime : COLORS.border}`,
      boxShadow: featured ? `0 0 0 1px ${COLORS.lime}` : "none",
    }}>
      <button
        onClick={() => onSelect(meal)}
        style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: "24px" }}
        onMouseDown={e => e.currentTarget.style.opacity = "0.8"}
        onMouseUp={e => e.currentTarget.style.opacity = "1"}
      >
        {featured && (
          <div style={{ display: "inline-flex", alignItems: "center", background: COLORS.lime, borderRadius: "100px", padding: "3px 10px", marginBottom: "12px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: COLORS.dark, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em" }}>✦ Top pick</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "32px", marginBottom: "10px" }}>{meal.emoji}</div>
            <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "21px", fontWeight: "400", color: COLORS.dark, marginBottom: "6px" }}>
              {meal.name}
            </div>
            {meal.description && (
              <div style={{ fontSize: "13px", color: COLORS.dark, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.45, marginBottom: "8px", opacity: 0.75 }}>
                {meal.description}
              </div>
            )}
            <div style={{ fontSize: "13px", color: COLORS.muted, fontFamily: "'DM Sans', sans-serif", display: "flex", gap: "10px", marginBottom: meal.macros ? "12px" : "0" }}>
              <span>⏱ {meal.time}</span><span>· {meal.difficulty}</span><span>· 🔥 {meal.calories} kcal</span>
            </div>
            {meal.macros && (
              <MacroBar protein={meal.macros.protein} carbs={meal.macros.carbs} fat={meal.macros.fat} calories={meal.calories} />
            )}
          </div>
          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: featured ? COLORS.lime : COLORS.cream, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", flexShrink: 0, marginLeft: "12px" }}>→</div>
        </div>
      </button>
    </div>
  );
}

// ─── SCREEN 2: RESULTS ────────────────────────────────────────────────────────
function ResultsScreen({ prefs, meals, onSelect, onBack, onRegenerate, isLoading }) {
  const [cuisine, setCuisine] = useState("Any");

  const summaryParts = [
    SEASON_EMOJI[prefs.season] + " " + prefs.season,
    !prefs.proteins.includes("Any") && prefs.proteins.join(", "),
    `${prefs.calories} kcal`,
    `${prefs.people} ${prefs.people === 1 ? "serving" : "servings"}`,
  ].filter(Boolean);

  return (
    <div style={{ paddingBottom: "40px" }}>
      <div style={{ padding: "56px 24px 20px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 0 12px 0", color: COLORS.muted, fontSize: "14px", fontFamily: "'DM Sans', sans-serif" }}>
          ← Back
        </button>
        <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "30px", fontWeight: "400", color: COLORS.dark, margin: "0 0 8px", lineHeight: 1.1 }}>
          Here's what<br />you can make
        </h2>
        <p style={{ color: COLORS.muted, fontSize: "13px", fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
          {summaryParts.join(" · ")}
        </p>
      </div>

      {/* Meal cards */}
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
        {meals.map((meal, i) => <MealCard key={meal.id} meal={meal} featured={i === 0} onSelect={onSelect} />)}
      </div>

      {/* Cuisine + Regenerate — in scroll, below cards */}
      <div style={{ padding: "24px 24px 0" }}>
        <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", color: COLORS.muted, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>
            🍽 Try a cuisine
          </div>
          {/* Cuisine chips — wrapping */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
            {CUISINE_CHIPS.map(c => (
              <Chip key={c} label={c} selected={cuisine === c} onClick={() => setCuisine(c)} accent />
            ))}
          </div>
          {/* Regenerate button */}
          <button
            onClick={() => onRegenerate(cuisine)}
            disabled={isLoading}
            style={{
              width: "100%", padding: "16px", borderRadius: "100px",
              border: `1.5px solid ${cuisine !== "Any" ? "transparent" : COLORS.border}`,
              background: isLoading ? COLORS.muted : cuisine !== "Any" ? COLORS.dark : "transparent",
              color: isLoading ? COLORS.cream : cuisine !== "Any" ? COLORS.cream : COLORS.dark,
              fontSize: "15px", fontWeight: "600", fontFamily: "'DM Sans', sans-serif",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            {isLoading
              ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>✦</span>Finding ideas...</>
              : `↻ ${cuisine !== "Any" ? `Regenerate as ${cuisine}` : "Regenerate ideas"}`
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 3: RECIPE ─────────────────────────────────────────────────────────
function RecipeScreen({ meal, onBack }) {
  const heroIngredients             = meal.ingredients || [];
  const pantryIngredients           = meal.pantryUsed || [];
  const allIngredients              = [...heroIngredients, ...pantryIngredients];
  const pantrySet                   = new Set(pantryIngredients);
  const [ingredients, setIngredients] = useState(allIngredients);
  const [swappingIndex, setSwappingIndex] = useState(null);
  const [swapVal, setSwapVal]       = useState("");
  const [method, setMethod]         = useState(meal.method);
  const [regenLoading, setRegenLoading] = useState(false);
  const [hasEdits, setHasEdits]     = useState(false);
  const [copied, setCopied]         = useState(false);

  const exportIngredients = () => {
    const text = `${meal.name} — Ingredients\n\n${ingredients.join("\n")}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback for environments where clipboard API isn't available
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const removeIngredient = (i) => {
    setIngredients(prev => prev.filter((_, idx) => idx !== i));
    setHasEdits(true);
    if (swappingIndex === i) setSwappingIndex(null);
  };

  const startSwap = (i) => {
    setSwapVal(ingredients[i]);
    setSwappingIndex(i);
  };

  const confirmSwap = (i) => {
    const val = swapVal.trim();
    if (!val) { setSwappingIndex(null); return; }
    setIngredients(prev => prev.map((ing, idx) => idx === i ? val : ing));
    setSwappingIndex(null);
    setSwapVal("");
    setHasEdits(true);
  };

  const regenerateMethod = async () => {
    setRegenLoading(true);
    const prompt = `You are a cooking assistant. A user has modified the ingredients for "${meal.name}".

Updated ingredients: ${ingredients.join(", ")}

Write a new method (4-5 steps) for this dish using only these ingredients. Assume standard pantry staples like oil, salt and pepper are available.

Respond ONLY with a JSON array of steps, e.g. ["Step one.", "Step two.", "Step three.", "Step four."]
No explanation, no markdown.`;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 600,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data  = await response.json();
      const text  = data.content[0].text;
      const clean = text.replace(/```json|```/g, "").trim();
      const steps = JSON.parse(clean);
      setMethod(steps);
      setHasEdits(false);
    } catch {
      // silently keep existing method if API fails
    } finally {
      setRegenLoading(false);
    }
  };

  return (
    <div style={{ paddingBottom: "40px" }}>
      <style>{`::-webkit-scrollbar{display:none}`}</style>

      {/* Hero */}
      <div style={{ background: COLORS.cream, padding: "56px 24px 24px", borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted, fontSize: "14px", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
          <button
            onClick={exportIngredients}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "7px 14px", borderRadius: "100px", cursor: "pointer",
              border: `1.5px solid ${copied ? "transparent" : COLORS.border}`,
              background: copied ? COLORS.lime : "transparent",
              color: copied ? COLORS.dark : COLORS.dark,
              fontSize: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: "600",
              transition: "all 0.2s ease",
            }}
          >
            {copied ? "✓ Copied!" : "↑ Export ingredients"}
          </button>
        </div>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>{meal.emoji}</div>
        <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "32px", fontWeight: "400", color: COLORS.dark, margin: "0 0 12px" }}>{meal.name}</h2>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ background: COLORS.lime, borderRadius: "100px", padding: "5px 14px", fontSize: "13px", fontWeight: "600", color: COLORS.dark, fontFamily: "'DM Sans', sans-serif" }}>⏱ {meal.time}</span>
          <span style={{ background: COLORS.card, borderRadius: "100px", padding: "5px 14px", fontSize: "13px", color: COLORS.dark, fontFamily: "'DM Sans', sans-serif" }}>{meal.difficulty}</span>
          <span style={{ background: COLORS.card, borderRadius: "100px", padding: "5px 14px", fontSize: "13px", color: COLORS.dark, fontFamily: "'DM Sans', sans-serif" }}>🔥 {meal.calories} kcal</span>
        </div>
        {meal.macros && (
          <div style={{ marginTop: "16px" }}>
            <MacroBar protein={meal.macros.protein} carbs={meal.macros.carbs} fat={meal.macros.fat} size="lg" calories={meal.calories} />
          </div>
        )}
      </div>

      <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", gap: "32px" }}>

        {/* Ingredients */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px" }}>
            <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "22px", fontWeight: "400", color: COLORS.dark, margin: 0 }}>Ingredients</h3>
            <span style={{ fontSize: "11px", color: COLORS.muted, fontFamily: "'DM Sans', sans-serif", fontStyle: "italic" }}>swap or remove</span>
          </div>

          {ingredients.map((ing, i) => (
            <div key={i}>
              {swappingIndex === i ? (
                /* Swap input row */
                <div style={{ padding: "10px 0", borderBottom: i < ingredients.length - 1 ? `1px solid ${COLORS.border}` : "none", display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    autoFocus
                    value={swapVal}
                    onChange={e => setSwapVal(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") confirmSwap(i); if (e.key === "Escape") setSwappingIndex(null); }}
                    style={{
                      flex: 1, padding: "9px 14px", borderRadius: "100px",
                      border: `1.5px solid ${COLORS.dark}`, background: COLORS.card,
                      fontSize: "14px", fontFamily: "'DM Sans', sans-serif",
                      color: COLORS.dark, outline: "none",
                    }}
                  />
                  <button onClick={() => confirmSwap(i)} style={{ width: 32, height: 32, borderRadius: "50%", background: COLORS.dark, border: "none", color: COLORS.lime, fontSize: "15px", cursor: "pointer", flexShrink: 0 }}>✓</button>
                  <button onClick={() => setSwappingIndex(null)} style={{ width: 32, height: 32, borderRadius: "50%", background: "transparent", border: `1.5px solid ${COLORS.border}`, color: COLORS.muted, fontSize: "13px", cursor: "pointer", flexShrink: 0 }}>✕</button>
                </div>
              ) : (
                /* Normal ingredient row */
                <div style={{ padding: "14px 0", borderBottom: i < ingredients.length - 1 ? `1px solid ${COLORS.border}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "15px", color: COLORS.dark, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4, flex: 1 }}>{ing}</span>
                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    {/* Swap icon — solid lime circle */}
                    <button
                      onClick={() => startSwap(i)}
                      title="Swap ingredient"
                      style={{
                        width: "30px", height: "30px", borderRadius: "50%",
                        background: COLORS.lime, border: "none",
                        cursor: "pointer", fontSize: "14px", color: COLORS.dark,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, fontWeight: "700", lineHeight: 1,
                      }}
                    >⇄</button>
                    {/* Remove icon */}
                    <button
                      onClick={() => removeIngredient(i)}
                      title="Remove ingredient"
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: COLORS.border, padding: "0", lineHeight: 1 }}
                    >✕</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Regenerate method CTA — shown when edits have been made */}
        {hasEdits && (
          <button
            onClick={regenerateMethod}
            disabled={regenLoading}
            style={{
              width: "100%", padding: "16px", borderRadius: "100px", border: "none",
              background: regenLoading ? COLORS.muted : COLORS.lime,
              color: COLORS.dark, fontSize: "15px", fontWeight: "700",
              fontFamily: "'DM Sans', sans-serif", cursor: regenLoading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            {regenLoading
              ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>✦</span>Updating method...</>
              : "✦ Regenerate method with new ingredients"
            }
          </button>
        )}

        {/* Method */}
        <div>
          <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "22px", fontWeight: "400", color: COLORS.dark, margin: "0 0 16px" }}>Method</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {method.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: COLORS.lime, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", color: COLORS.dark, fontFamily: "'DM Sans', sans-serif", flexShrink: 0, marginTop: "1px" }}>{i + 1}</div>
                <p style={{ margin: 0, fontSize: "15px", lineHeight: "1.6", color: COLORS.dark, fontFamily: "'DM Sans', sans-serif" }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]             = useState("input");
  const [prefs, setPrefs]               = useState(null);
  const [meals, setMeals]               = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isLoading, setIsLoading]       = useState(false);
  const [apiError, setApiError]         = useState(null);

  const handleGenerate = async (p) => {
    setPrefs(p);
    setApiError(null);
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{ role: "user", content: buildPrompt(p) }],
        }),
      });
      const data      = await response.json();
      const text      = data.content[0].text;
      const clean     = text.replace(/```json|```/g, "").trim();
      const generated = JSON.parse(clean);
      setMeals(generated.map((meal, i) => ({ ...meal, id: i + 1 })));
    } catch (err) {
      setApiError("Couldn't connect — showing example meals instead.");
      setMeals(MOCK_MEALS);
    } finally {
      setIsLoading(false);
      setScreen("results");
    }
  };

  return (
    <div style={{ background: COLORS.cream, minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "390px", minHeight: "844px", background: COLORS.cream }}>
        {screen === "input" && <InputScreen onGenerate={handleGenerate} isLoading={isLoading} />}
        {screen === "results" && (
          <>
            {apiError && (
              <div style={{ background: "#FFF0ED", borderBottom: `1px solid #F5C2B8`, padding: "10px 24px", fontSize: "12px", color: "#B94040", fontFamily: "'DM Sans', sans-serif" }}>
                ⚠ {apiError}
              </div>
            )}
            <ResultsScreen prefs={prefs} meals={meals} isLoading={isLoading} onSelect={(m) => { setSelectedMeal(m); setScreen("recipe"); }} onBack={() => setScreen("input")} onRegenerate={(cuisine) => handleGenerate({ ...prefs, cuisine })} />
          </>
        )}
        {screen === "recipe" && <RecipeScreen meal={selectedMeal} onBack={() => setScreen("results")} />}
      </div>
    </div>
  );
}
