import { ChickenIcon, VegeIcon, BeefIcon, SeafoodIcon, EmojiIcon } from "./icons.jsx";

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
  "Pasta & Noodles": { icon: (active) => <EmojiIcon emoji="🍝" active={active}/>, items: ["Pasta","Spaghetti","Penne","Fettuccine","Gnocchi","Orzo","Noodles","Udon noodles","Soba noodles","Rice noodles","Glass noodles","Couscous","Polenta"] },
  "Rice & Grains":   { icon: (active) => <EmojiIcon emoji="🍚" active={active}/>, items: ["Rice","Basmati rice","Jasmine rice","Brown rice","Arborio rice","Quinoa","Bulgur wheat","Pearl barley","Freekeh","Farro","Millet"] },
  "Bread & Wraps":   { icon: (active) => <EmojiIcon emoji="🫓" active={active}/>, items: ["Sourdough","White bread","Wholegrain bread","Flatbread","Tortillas","Corn tortillas","Pita","Naan","Bao buns","Burger buns","Crumpets","English muffins"] },
  "Potato & Root":   { icon: (active) => <EmojiIcon emoji="🥔" active={active}/>, items: ["Potatoes","Kumara","Sweet potato","Baby potatoes","Parsnip","Cassava","Taro","Yam"] },
  "No carbs":        { icon: (active) => <EmojiIcon emoji="🚫" active={active}/>, items: ["No carbs"] },
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

export const MOCK_MEALS = [
  { id:1, name:"Chicken Stir Fry", emoji:"🥢", description:"Quick and flavourful with seasonal vegetables", time:"25 mins", difficulty:"Easy", calories:520, ingredients:["Chicken breast 400g","Bok choy","Capsicum","Soy sauce","Ginger","Garlic","Sesame oil","Rice noodles"], pantryUsed:[], macros:{ protein:45, carbs:35, fat:20 }, method:["Slice chicken and marinate in soy and ginger for 10 mins.","Heat wok until smoking, cook chicken until golden.","Add vegetables and stir fry for 3–4 mins.","Toss through noodles and serve."] },
  { id:2, name:"Lamb Shoulder Ragu", emoji:"🍝", description:"Slow cooked and deeply satisfying", time:"3 hrs", difficulty:"Medium", calories:680, ingredients:["Lamb shoulder 600g","Tinned tomatoes","Red wine","Garlic","Rosemary","Pasta"], pantryUsed:[], macros:{ protein:38, carbs:42, fat:20 }, method:["Brown lamb shoulder in batches.","Deglaze with red wine, add tomatoes and herbs.","Slow cook for 2.5 hours until falling apart.","Shred meat and toss through pasta."] },
  { id:3, name:"Salmon Poke Bowl", emoji:"🥗", description:"Fresh and vibrant, ready in minutes", time:"15 mins", difficulty:"Easy", calories:490, ingredients:["Salmon fillet 300g","Sushi rice","Avocado","Cucumber","Edamame","Soy sauce","Sesame seeds"], pantryUsed:[], macros:{ protein:35, carbs:45, fat:20 }, method:["Cook sushi rice and season with rice vinegar.","Dice salmon and marinate in soy and sesame.","Assemble bowl with rice, salmon and toppings.","Finish with sesame seeds and a drizzle of soy."] },
];
