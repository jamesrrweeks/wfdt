import { ChickenIcon, VegeIcon, BeefIcon, SeafoodIcon, RiceIcon, NoodlesIcon, BreadIcon, RootVegeIcon, SummerIcon, AutumnIcon, WinterIcon, SpringIcon, AllYearIcon } from "./icons.jsx";

export const SEASONS = ["Summer", "Autumn", "Winter", "Spring"];
export const SEASON_EMOJI = { Summer:"☀️", Autumn:"🍂", Winter:"❄️", Spring:"🌸" };
export const CURRENT_SEASON = "Autumn";

export const VIBE_CHIPS    = ["Comfort Food","Quick & Light","Fakeaway","Something Fresh","Fancy It Up"];
export const TIME_CHIPS    = ["15 mins","30 mins","45 mins+"];
export const CUISINE_CHIPS = ["Any","Italian","Asian","Mexican","Middle Eastern","Indian","Japanese","French","American","Mediterranean"];

export const PROTEIN_CATEGORIES = {
  "Chicken":     { icon: (active) => <ChickenIcon active={active}/>,  items: ["Chicken breast","Chicken thighs","Chicken mince","Chicken drumsticks","Chicken wings","Turkey mince","Turkey breast","Duck","Duck breast"] },
  "Vegetarian":  { icon: (active) => <VegeIcon active={active}/>,     items: ["Eggs","Tofu","Firm tofu","Silken tofu","Tempeh","Chickpeas","Lentils","Red lentils","Kidney beans","Black beans","Butter beans","Edamame","Halloumi","Paneer","Quorn mince"] },
  "Beef & Lamb": { icon: (active) => <BeefIcon active={active}/>,     items: ["Beef mince","Beef steak","Beef strips","Beef short ribs","Beef brisket","Lamb chops","Lamb mince","Lamb shoulder","Lamb rack","Lamb shank","Sausages","Pork belly","Pork mince","Pork chops","Pork shoulder","Pork ribs","Bacon","Ham","Chorizo","Pancetta","Prosciutto"] },
  "Seafood":     { icon: (active) => <SeafoodIcon active={active}/>,  items: ["Salmon","Salmon fillet","White fish","Snapper","Tarakihi","Blue cod","Prawns","Tuna (canned)","Sardines","Mussels","Squid","Scallops","Crab","Smoked salmon"] },
};

export const CARB_CATEGORIES = {
  "Pasta & Noodles": { icon: (active) => <NoodlesIcon active={active}/>,  items: ["Pasta","Spaghetti","Penne","Fettuccine","Gnocchi","Orzo","Noodles","Udon noodles","Soba noodles","Rice noodles","Glass noodles","Couscous","Polenta"] },
  "Rice & Grains":   { icon: (active) => <RiceIcon active={active}/>,     items: ["Rice","Basmati rice","Jasmine rice","Brown rice","Arborio rice","Quinoa","Bulgur wheat","Pearl barley","Freekeh","Farro","Millet"] },
  "Bread & Wraps":   { icon: (active) => <BreadIcon active={active}/>,    items: ["Sourdough","White bread","Wholegrain bread","Flatbread","Tortillas","Corn tortillas","Pita","Naan","Bao buns","Burger buns","Crumpets","English muffins"] },
  "Potato & Root":   { icon: (active) => <RootVegeIcon active={active}/>, items: ["Potatoes","Kumara","Sweet potato","Baby potatoes","Parsnip","Cassava","Taro","Yam"] },
};

export const SEASON_CATEGORIES = {
  "All year": { icon: (active) => <AllYearIcon active={active}/> },
  "Summer":   { icon: (active) => <SummerIcon active={active}/> },
  "Autumn":   { icon: (active) => <AutumnIcon active={active}/> },
  "Winter":   { icon: (active) => <WinterIcon active={active}/> },
  "Spring":   { icon: (active) => <SpringIcon active={active}/> },
};

export const SEASONAL_VEG = {
  "All year": ["Onion","Red onion","Garlic","Celery","Capsicum","Spinach","Baby spinach","Broccoli","Courgette","Mushrooms","Button mushrooms","Silverbeet","Carrot","Tomatoes","Cucumber","Avocado","Corn","Pumpkin"],
  Summer:     ["Courgette","Capsicum","Tomatoes","Cherry tomatoes","Corn","Cucumber","Eggplant","Beans","Green beans","Peas","Spinach","Lettuce","Rocket","Zucchini flowers","Basil"],
  Autumn:     ["Pumpkin","Butternut squash","Kumara","Carrot","Beetroot","Broccoli","Broccolini","Cauliflower","Cabbage","Silverbeet","Kale","Leek","Mushrooms","Shiitake","Capsicum","Feijoa","Parsnip"],
  Winter:     ["Kumara","Pumpkin","Parsnip","Carrot","Beetroot","Cauliflower","Cabbage","Savoy cabbage","Kale","Brussels sprouts","Broccoli","Leek","Silverbeet","Spinach","Onion","Spring onion","Celeriac"],
  Spring:     ["Asparagus","Peas","Snap peas","Broad beans","Beans","Spinach","Baby spinach","Lettuce","Radish","Spring onion","Courgette","Broccolini","Fennel","Artichoke"],
};

export const PANTRY_STAPLES = ["Olive oil","Garlic","Salt & pepper","Onion","Soy sauce","Butter","Lemon"];

export const TYPEAHEAD_INGREDIENTS = [
  "Anchovies","Apple","Apricots","Artichoke","Asparagus","Avocado","Baby spinach","Bacon",
  "Balsamic vinegar","Banana","Basil","Bay leaves","Bean sprouts","Black beans","Black olives",
  "Bok choy","Breadcrumbs","Broccolini","Brown sugar","Capers","Cardamom","Cashews","Celery",
  "Cheddar cheese","Chilli flakes","Chilli sauce","Chorizo","Cider vinegar","Cinnamon",
  "Coconut cream","Coconut milk","Coriander","Corn flour","Cream","Cream cheese","Crème fraîche",
  "Cumin","Curry paste","Curry powder","Dates","Dill","Dried apricots","Dried cranberries",
  "Dried oregano","Edamame","Fennel","Feta cheese","Fish sauce","Five spice","Flour",
  "Garam masala","Ginger","Greek yoghurt","Green beans","Green olives","Harissa","Hoisin sauce",
  "Honey","Jalapeño","Kale","Ketchup","Leeks","Lime","Lime leaves","Mango","Maple syrup",
  "Mayonnaise","Mint","Miso paste","Mixed herbs","Mozzarella","Mushrooms","Mustard",
  "Mustard seeds","Nutmeg","Oats","Oyster sauce","Paprika","Parmesan","Parsley","Passata",
  "Peanut butter","Peanuts","Pecans","Pesto","Pine nuts","Pomegranate","Pomegranate molasses",
  "Pumpkin seeds","Red cabbage","Red wine","Red wine vinegar","Rice wine vinegar","Ricotta",
  "Rocket","Rosemary","Sesame oil","Sesame seeds","Shallots","Smoked paprika","Sour cream",
  "Spring onions","Star anise","Stock cubes","Chicken stock","Beef stock","Vegetable stock",
  "Sunflower seeds","Sweet chilli","Tahini","Tamarind","Thyme","Tinned tomatoes","Tomato paste",
  "Turmeric","Vanilla","Walnuts","White wine","White wine vinegar","Worcestershire sauce",
  "Yoghurt","Za'atar","Sumac","Dukkah","Preserved lemon","Chipotle paste","Sriracha",
  "Mirin","Dried chilli","Chilli powder","Smoked salt","Sea salt flakes","Italian herbs",
  "Ras el hanout","Baharat","Harissa paste","Sun-dried tomatoes","Caramelised onions",
];

export const DEFAULT_MACROS = { protein:30, carbs:40, fat:30 };

export const MACRO_PRESETS = [
  { name:"Balanced",     protein:30, carbs:40, fat:30 },
  { name:"High Protein", protein:45, carbs:30, fat:25 },
  { name:"Low Carb",     protein:35, carbs:20, fat:45 },
  { name:"Keto",         protein:25, carbs:5,  fat:70 },
  { name:"High Carb",    protein:20, carbs:55, fat:25 },
  { name:"Low Fat",      protein:40, carbs:45, fat:15 },
];

// ─── MOCK_MEALS — replace the existing MOCK_MEALS constant in src/data.jsx ───
// Everything else in data.jsx stays exactly the same.

export const MOCK_MEALS = [
  {
    id: 1,
    name: "Chicken Stir Fry",
    icon: "Rice & Grains",
    cuisine: "Asian",
    description: "Quick and flavourful with seasonal vegetables",
    time: "25 mins",
    difficulty: "Easy",
    calories: 520,
    ingredients: [
      { name: "Chicken breast", amount: "400g",    source: "user", suggestions: ["Tofu", "Salmon fillet", "Chickpeas", "Turkey mince"] },
      { name: "Bok choy",       amount: "2 heads",  source: "user", suggestions: ["Broccolini", "Spinach", "Cabbage", "Snow peas"] },
      { name: "Capsicum",       amount: "1 whole",  source: "user", suggestions: ["Zucchini", "Carrot", "Sugar snap peas", "Baby corn"] },
      { name: "Rice noodles",   amount: "200g",    source: "user", suggestions: ["Udon noodles", "Soba noodles", "Brown rice", "Vermicelli"] },
      { name: "Soy sauce",      amount: "3 tbsp",  source: "ai",   suggestions: ["Tamari", "Coconut aminos", "Fish sauce"] },
      { name: "Ginger",         amount: "2 tsp",   source: "ai",   suggestions: ["Ginger powder", "Lemongrass", "Galangal"] },
      { name: "Garlic",         amount: "3 cloves", source: "ai",  suggestions: ["Garlic powder", "Shallots", "Leek"] },
      { name: "Sesame oil",     amount: "1 tbsp",  source: "ai",   suggestions: ["Peanut oil", "Avocado oil", "Chilli oil"] },
    ],
    pantryUsed: [],
    macros: { protein: 45, carbs: 35, fat: 20 },
    method: [
      "Slice chicken and marinate in soy and ginger for 10 mins.",
      "Heat wok until smoking, cook chicken until golden.",
      "Add vegetables and stir fry for 3–4 mins.",
      "Toss through noodles and serve.",
    ],
  },
  {
    id: 2,
    name: "Lamb Shoulder Ragu",
    icon: "Pasta & Noodles",
    cuisine: "Italian",
    description: "Slow cooked and deeply satisfying",
    time: "3 hrs",
    difficulty: "Medium",
    calories: 680,
    ingredients: [
      { name: "Lamb shoulder",   amount: "600g",    source: "user", suggestions: ["Beef chuck", "Pork shoulder", "Chicken thighs", "Jackfruit"] },
      { name: "Pasta",           amount: "300g",    source: "user", suggestions: ["Gnocchi", "Polenta", "Pappardelle", "Risoni"] },
      { name: "Tinned tomatoes", amount: "400g",    source: "ai",   suggestions: ["Passata", "Fresh tomatoes", "Tomato paste + water"] },
      { name: "Red wine",        amount: "150ml",   source: "ai",   suggestions: ["Beef stock", "Balsamic vinegar", "Pomegranate juice"] },
      { name: "Garlic",          amount: "4 cloves", source: "ai",  suggestions: ["Garlic powder", "Shallots", "Onion"] },
      { name: "Rosemary",        amount: "3 sprigs", source: "ai",  suggestions: ["Thyme", "Oregano", "Bay leaves", "Italian herbs"] },
    ],
    pantryUsed: [],
    macros: { protein: 38, carbs: 42, fat: 20 },
    method: [
      "Brown lamb shoulder in batches.",
      "Deglaze with red wine, add tomatoes and herbs.",
      "Slow cook for 2.5 hours until falling apart.",
      "Shred meat and toss through pasta.",
    ],
  },
  {
    id: 3,
    name: "Salmon Poke Bowl",
    icon: "Seafood",
    cuisine: "Japanese",
    description: "Fresh and vibrant, ready in minutes",
    time: "15 mins",
    difficulty: "Easy",
    calories: 490,
    ingredients: [
      { name: "Salmon fillet", amount: "300g",   source: "user", suggestions: ["Tuna steak", "Tofu", "Cooked prawns", "Snapper"] },
      { name: "Sushi rice",    amount: "200g",   source: "user", suggestions: ["Brown rice", "Cauliflower rice", "Quinoa"] },
      { name: "Avocado",       amount: "1 whole", source: "user", suggestions: ["Edamame", "Cucumber", "Mango"] },
      { name: "Cucumber",      amount: "½ whole", source: "user", suggestions: ["Radish", "Zucchini ribbons", "Carrot"] },
      { name: "Edamame",       amount: "100g",   source: "user", suggestions: ["Peas", "Broad beans", "Corn kernels"] },
      { name: "Soy sauce",     amount: "2 tbsp", source: "ai",   suggestions: ["Tamari", "Coconut aminos", "Ponzu"] },
      { name: "Sesame seeds",  amount: "1 tbsp", source: "ai",   suggestions: ["Furikake", "Toasted nori", "Crushed peanuts"] },
      { name: "Rice vinegar",  amount: "1 tbsp", source: "ai",   suggestions: ["Apple cider vinegar", "Lemon juice", "Lime juice"] },
    ],
    pantryUsed: [],
    macros: { protein: 35, carbs: 45, fat: 20 },
    method: [
      "Cook sushi rice and season with rice vinegar.",
      "Dice salmon and marinate in soy and sesame.",
      "Assemble bowl with rice, salmon and toppings.",
      "Finish with sesame seeds and a drizzle of soy.",
    ],
  },
];
