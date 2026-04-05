import { useState, useRef, useEffect } from "react";

// ─── DESIGN TOKENS (exact Figma variables) ───────────────────────────────────
const C = {
  // Brand
  primary:      "#CDEA45",  // lime — primary brand, selected state, CTA
  // Sentiment
  red:          "#BC4749",  // errors, destructive
  // Background scale
  textStrong:   "#3D331A",  // primary text, icons, most interactions
  textWeak:     "#7A7059",  // secondary / muted text
  strokeStrong: "#A69A80",  // borders, dividers
  strokeWeak:   "#F0ECE4",  // page background
  fill:         "#FAF8F5",  // input fields, stepper buttons
  background:   "#FFFFFF",  // cards, chip backgrounds
  // Aliases
  get dark()   { return this.textStrong  },
  get lime()   { return this.primary     },
  get muted()  { return this.textWeak    },
  get border() { return this.strokeStrong },
  get bg()     { return this.strokeWeak  },
  get white()  { return this.background  },
  get inputBg(){ return this.fill        },
  // Selected ingredient pills
  pill:         "#3D331A",
  pillText:     "#FAF8F5",
  shadow:       "rgba(61,51,26,0.08)",
};

// ─── SPACING TOKENS ───────────────────────────────────────────────────────────
const SPACE = {
  nil: 0,
  xxs: 4,
  xs:  8,
  s:   16,
  m:   24,
  l:   32,
  xl:  48,
  xxl: 80,
};

// ─── TYPOGRAPHY TOKENS ────────────────────────────────────────────────────────
const F = "'Atkinson Hyperlegible', sans-serif";

const T = {
  h1:    { fontSize:"40px", lineHeight:"48px", fontFamily:F, fontWeight:"700" },
  h2:    { fontSize:"32px", lineHeight:"40px", fontFamily:F, fontWeight:"700" },
  h3:    { fontSize:"20px", lineHeight:"28px", fontFamily:F, fontWeight:"700" },
  small: { fontSize:"16px", lineHeight:"24px", fontFamily:F, fontWeight:"400" },
  tiny:  { fontSize:"14px", lineHeight:"20px", fontFamily:F, fontWeight:"400" },
};

// ─── ELEVATION ────────────────────────────────────────────────────────────────
const SHADOW = {
  raised:  "0px 2px 2px rgba(51,61,26,0.1)",
  overlay: "0px 8px 6px -2px rgba(61,51,26,0.15)",
};

// ─── CATEGORY TAB BUTTON ──────────────────────────────────────────────────────
// Exact Figma spec — 80×64px, col layout, icon + label, active/inactive states
function CategoryTab({ label, icon, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display:"flex", flexDirection:"column",
      justifyContent:"center", alignItems:"center",
      padding:`${SPACE.xs}px ${SPACE.m}px`,
      gap:`${SPACE.xxs}px`,
      height:"64px", flexShrink:0,
      background: active ? C.textStrong : C.fill,
      border: active ? "none" : `1px solid ${C.strokeStrong}`,
      boxShadow: SHADOW.raised,
      borderRadius:"8px",
      cursor:"pointer", transition:"all 0.15s",
    }}>
      <div style={{ width:24, height:24, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        {icon && icon(active)}
      </div>
      <span style={{
        ...T.tiny,
        color: active ? "#FFFFFF" : C.textStrong,
        textAlign:"center",
        whiteSpace:"nowrap",
      }}>{label}</span>
    </button>
  );
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const SEASONS = ["Summer", "Autumn", "Winter", "Spring"];
const SEASON_EMOJI = { Summer: "☀️", Autumn: "🍂", Winter: "❄️", Spring: "🌸" };
const CURRENT_SEASON = "Autumn";

const VIBE_CHIPS    = ["Comfort Food", "Quick & Light", "Fakeaway", "Something Fresh", "Fancy It Up"];
const TIME_CHIPS    = ["15 mins", "30 mins", "45 mins+"];
const CUISINE_CHIPS = ["Any", "Italian", "Asian", "Mexican", "Middle Eastern", "Indian", "Japanese", "French", "American", "Mediterranean"];

// ─── ICONS ────────────────────────────────────────────────────────────────────
// Each icon accepts active prop — colours flip between active/inactive states
const ICON_COLORS = {
  active:   { fill: "#7A7059", stroke: "#FAF8F5" },
  inactive: { fill: "#A69A80", stroke: "#3D331A"  },
};

const ChickenIcon = ({ active }) => {
  const { fill, stroke } = active ? ICON_COLORS.active : ICON_COLORS.inactive;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#chicken-clip)">
        <path fillRule="evenodd" clipRule="evenodd" d="M12.5175 11.7757C14.0949 10.4553 16.2565 10.317 17.5987 11.5391C18.5006 12.3602 18.8255 13.6071 18.5875 14.8508L18.9491 15.0339C21.4845 16.2358 22.1867 17.7871 22.1867 19.9214V20.4302C22.1867 21.377 21.419 22.1444 20.4724 22.1444H2.81164C2.25175 22.1444 1.72415 21.8695 1.50971 21.3523C1.03395 20.2047 0.482518 17.9002 1.91762 15.0341C3.99139 10.8923 9.09542 9.98262 12.3633 11.6976L12.5175 11.7757Z" fill={fill}/>
        <path d="M3.84521 3.84937V6.52794" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.6665 3.84937V6.52794" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.75586 1.85553V4.5341" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19.728 7.88916C19.728 8.32335 19.9005 8.73977 20.2075 9.04679C20.5146 9.35382 20.931 9.5263 21.3652 9.5263C21.7994 9.5263 22.2158 9.35382 22.5228 9.04679C22.8298 8.73977 23.0023 8.32335 23.0023 7.88916C23.0023 7.45496 22.8298 7.03855 22.5228 6.73152C22.2158 6.4245 21.7994 6.25201 21.3652 6.25201C20.931 6.25201 20.5146 6.4245 20.2075 6.73152C19.9005 7.03855 19.728 7.45496 19.728 7.88916Z" fill="#A69A80"/>
        <path d="M19.73 7.88916C19.73 8.32335 19.9025 8.73977 20.2095 9.04679C20.5165 9.35382 20.9329 9.5263 21.3671 9.5263C21.8013 9.5263 22.2177 9.35382 22.5248 9.04679C22.8318 8.73977 23.0043 8.32335 23.0043 7.88916C23.0043 7.45496 22.8318 7.03855 22.5248 6.73152C22.2177 6.4245 21.8013 6.25201 21.3671 6.25201C20.9329 6.25201 20.5165 6.4245 20.2095 6.73152C19.9025 7.03855 19.73 7.45496 19.73 7.88916Z" stroke={stroke} strokeWidth="2" strokeLinecap="round"/>
        <path d="M18.5826 14.8509L18.9481 15.0335C21.4837 16.2353 22.1857 17.7865 22.1857 19.921V20.4298C22.1857 21.3764 21.418 22.1441 20.4714 22.1441H2.81068C2.25077 22.1441 1.72317 21.8689 1.50874 21.3517C1.03297 20.2042 0.481542 17.8998 1.91664 15.0336C3.99043 10.8918 9.09444 9.98218 12.3623 11.6971L12.5214 11.7794" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17.4136 17.1531C19.0035 15.4071 19.0859 12.8935 17.5981 11.5387C16.1101 10.1839 13.6151 10.501 12.0253 12.247C10.5821 13.8321 10.3811 16.0498 11.4695 17.4588C11.58 17.6019 11.7038 17.7367 11.841 17.8615" stroke={stroke} strokeWidth="2" strokeLinecap="round"/>
        <path d="M19.79 9.52734L17.7944 11.6285" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="chicken-clip"><rect width="24" height="24" fill="white"/></clipPath>
      </defs>
    </svg>
  );
};

// Placeholder icon for categories without SVG yet — emoji fallback
const EmojiIcon = ({ emoji, active }) => (
  <span style={{ fontSize:"18px", filter: active ? "brightness(10)" : "none" }}>{emoji}</span>
);

const VegeIcon = ({ active }) => {
  const stroke = active ? "#FAF8F5" : "#3D331A";
  const fillLeaf = active ? "#7A7059" : "#A69A80";
  const fillStem = active ? "#A69A80" : "#F0ECE4";
  return (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#vege-clip)">
        <path d="M8.58057 5.62509C9.42697 3.21431 10.8827 0.653077 12.5813 1.2196C13.554 1.54404 13.6636 2.56566 13.5127 3.48208C13.4889 3.62713 13.926 3.8727 14.0341 3.77301C15.0703 2.81712 16.5339 2.07666 17.7402 3.28302C18.9465 4.48936 18.2061 5.95274 17.2503 6.98882C17.1507 7.09686 17.3961 7.53402 17.5413 7.51014C18.4576 7.35933 19.4793 7.46888 19.8037 8.44161C20.3694 10.1379 17.683 11.5839 15.3055 12.4326C15.3964 10.6043 14.2801 8.9463 13.1338 7.80003C12.0042 6.67037 10.3775 5.56985 8.58057 5.62509Z" fill={fillStem}/>
        <path d="M5.17872 7.26977C1.65942 10.7891 1.10642 15.284 1.34209 17.8457C1.42859 18.786 2.14774 19.5051 3.08803 19.5917C5.64978 19.8273 10.1447 19.2744 13.664 15.7551C16.6947 12.7243 14.9519 9.61838 13.1337 7.80011C11.3154 5.98182 8.20942 4.23905 5.17872 7.26977Z" fill={fillLeaf}/>
        <path d="M5.17871 7.26965C1.65942 10.7889 1.10642 15.2839 1.34209 17.8456C1.42859 18.786 2.14773 19.5051 3.08804 19.5916C5.64978 19.8273 10.1447 19.2742 13.664 15.7549C16.6947 12.7242 14.9519 9.61824 13.1337 7.79997C11.3154 5.9817 8.20943 4.23893 5.17871 7.26965Z" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.98877 7.45898L8.17075 10.641" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.58008 15.4138L9.60763 18.4414" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.58057 5.62509C9.42697 3.21431 10.8827 0.653077 12.5813 1.2196C13.554 1.54404 13.6636 2.56566 13.5127 3.48208C13.4889 3.62713 13.926 3.8727 14.0341 3.77301C15.0703 2.81712 16.5339 2.07666 17.7402 3.28302C18.9465 4.48936 18.2061 5.95274 17.2503 6.98882C17.1507 7.09686 17.3961 7.53402 17.5413 7.51014C18.4576 7.35933 19.4793 7.46888 19.8037 8.44161C20.3694 10.1379 17.683 11.5839 15.3055 12.4326C15.3964 10.6043 14.2801 8.9463 13.1338 7.80003C12.0042 6.67037 10.3775 5.56985 8.58057 5.62509Z" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs><clipPath id="vege-clip"><rect width="21" height="21" fill="white"/></clipPath></defs>
    </svg>
  );
};

const BeefIcon = ({ active }) => {
  const fill = active ? "#7A7059" : "#A69A80";
  const stroke = active ? "#FAF8F5" : "#3D331A";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 2C11.1072 1.99917 9.75093 2.44573 8.6311 3.2739C7.51128 4.10207 6.68708 5.26804 6.27996 6.6C5.17996 9.73 5.49996 10.5 3.09996 12.68C2.62172 13.0721 2.27633 13.6024 2.11106 14.1983C1.9458 14.7942 1.96873 15.4266 2.17673 16.009C2.38472 16.5914 2.76761 17.0953 3.27299 17.4517C3.77837 17.8081 4.38154 17.9996 4.99996 18C8.99996 18 13.4 16.2 16.4 13.7C17.4913 12.8815 18.2975 11.7403 18.7043 10.4381C19.1111 9.13591 19.0978 7.73875 18.6664 6.44452C18.235 5.15029 17.4073 4.02461 16.3006 3.22693C15.1938 2.42924 13.8642 2 12.5 2Z" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.4999 6L20.6899 10.5C20.8974 11.1463 21.002 11.8212 20.9999 12.5C21.0007 13.5092 20.7661 14.5047 20.3147 15.4074C19.8634 16.3101 19.2078 17.0951 18.3999 17.7C15.3999 20.2 10.9999 22 6.9999 22C6.44315 21.9992 5.8976 21.8436 5.42429 21.5504C4.95098 21.2572 4.56858 20.8381 4.3199 20.34L2.3999 16.5" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 8.5C10 9.16304 10.2634 9.79893 10.7322 10.2678C11.2011 10.7366 11.837 11 12.5 11C13.163 11 13.7989 10.7366 14.2678 10.2678C14.7366 9.79893 15 9.16304 15 8.5C15 7.83696 14.7366 7.20107 14.2678 6.73223C13.7989 6.26339 13.163 6 12.5 6C11.837 6 11.2011 6.26339 10.7322 6.73223C10.2634 7.20107 10 7.83696 10 8.5Z" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

const SeafoodIcon = ({ active }) => {
  const fill = active ? "#7A7059" : "#A69A80";
  const stroke = active ? "#FAF8F5" : "#3D331A";
  const sw = "1.57143";
  return (
    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#seafood-clip)">
        <path d="M9.3813 21.4286H13.5718V20.25C13.5718 18.7312 12.3406 17.5 10.8218 17.5H10.6908C9.24436 17.5 8.07178 18.6726 8.07178 20.1191C8.07178 20.8423 8.65808 21.4286 9.3813 21.4286Z" fill={fill}/>
        <path d="M4.92773 7.28566V5.71423H13.5706C17.9099 5.71423 21.4277 9.232 21.4277 13.5714C21.4277 17.9107 17.9099 21.4285 13.5706 21.4285V19.8571C15.3063 19.8571 16.7134 18.45 16.7134 16.7142C16.7134 14.9785 15.3063 13.5714 13.5706 13.5714H11.2134C7.74194 13.5714 4.92773 10.7572 4.92773 7.28566Z" fill={fill}/>
        <path d="M13.5706 21.4285C17.9099 21.4285 21.4277 17.9107 21.4277 13.5714C21.4277 9.232 17.9099 5.71423 13.5706 5.71423H4.92773V7.28566C4.92773 10.7572 7.74194 13.5714 11.2134 13.5714H13.5706C15.3063 13.5714 16.7134 14.9785 16.7134 16.7142C16.7134 18.45 15.3063 19.8571 13.5706 19.8571" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.5718 5.71423C13.5718 5.71423 15.1432 6.49995 15.1432 9.6428C15.1432 12.7857 13.5718 13.5714 13.5718 13.5714" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.3813 21.4286H13.5718V20.25C13.5718 18.7312 12.3406 17.5 10.8218 17.5H10.6908C9.24436 17.5 8.07178 18.6726 8.07178 20.1191C8.07178 20.8423 8.65808 21.4286 9.3813 21.4286Z" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.92857 5.71429H3.35714C2.05532 5.71429 1 4.65896 1 3.35714C1 2.05532 2.05532 1 3.35714 1H10.4286" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.0349 9.64271C9.81798 9.64271 9.64209 9.46682 9.64209 9.24985C9.64209 9.03288 9.81798 8.85699 10.0349 8.85699" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.0356 9.64271C10.2526 9.64271 10.4285 9.46682 10.4285 9.24985C10.4285 9.03288 10.2526 8.85699 10.0356 8.85699" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16.7139 15.9285C19.071 15.1428 20.6424 13.5713 20.6424 10.4285" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs><clipPath id="seafood-clip"><rect width="22.4277" height="22.4286" fill="white"/></clipPath></defs>
    </svg>
  );
};

const PROTEIN_CATEGORIES = {
  "Chicken":     { icon: (active) => <ChickenIcon active={active}/>,  items: ["Chicken breast","Chicken thighs","Chicken mince","Chicken drumsticks","Chicken wings","Turkey mince","Turkey breast","Duck","Duck breast"] },
  "Vegetarian":  { icon: (active) => <VegeIcon active={active}/>,     items: ["Eggs","Tofu","Firm tofu","Silken tofu","Tempeh","Chickpeas","Lentils","Red lentils","Kidney beans","Black beans","Butter beans","Edamame","Halloumi","Paneer","Quorn mince"] },
  "Beef & Lamb": { icon: (active) => <BeefIcon active={active}/>,     items: ["Beef mince","Beef steak","Beef strips","Beef short ribs","Beef brisket","Lamb chops","Lamb mince","Lamb shoulder","Lamb rack","Lamb shank","Sausages","Pork belly","Pork mince","Pork chops","Pork shoulder","Pork ribs","Bacon","Ham","Chorizo","Pancetta","Prosciutto"] },
  "Seafood":     { icon: (active) => <SeafoodIcon active={active}/>,  items: ["Salmon","Salmon fillet","White fish","Snapper","Tarakihi","Blue cod","Prawns","Tuna (canned)","Sardines","Mussels","Squid","Scallops","Crab","Smoked salmon"] },
};

const CARB_CATEGORIES = {
  "Pasta & Noodles": { icon: (active) => <EmojiIcon emoji="🍝" active={active}/>, items: ["Pasta","Spaghetti","Penne","Fettuccine","Gnocchi","Orzo","Noodles","Udon noodles","Soba noodles","Rice noodles","Glass noodles","Couscous","Polenta"] },
  "Rice & Grains":   { icon: (active) => <EmojiIcon emoji="🍚" active={active}/>, items: ["Rice","Basmati rice","Jasmine rice","Brown rice","Arborio rice","Quinoa","Bulgur wheat","Pearl barley","Freekeh","Farro","Millet"] },
  "Bread & Wraps":   { icon: (active) => <EmojiIcon emoji="🫓" active={active}/>, items: ["Sourdough","White bread","Wholegrain bread","Flatbread","Tortillas","Corn tortillas","Pita","Naan","Bao buns","Burger buns","Crumpets","English muffins"] },
  "Potato & Root":   { icon: (active) => <EmojiIcon emoji="🥔" active={active}/>, items: ["Potatoes","Kumara","Sweet potato","Baby potatoes","Parsnip","Cassava","Taro","Yam"] },
  "No carbs":        { icon: (active) => <EmojiIcon emoji="🚫" active={active}/>, items: ["No carbs"] },
};

const SEASONAL_VEG = {
  "All year": ["Onion","Red onion","Garlic","Celery","Capsicum","Spinach","Baby spinach","Broccoli","Courgette","Mushrooms","Button mushrooms","Silverbeet","Carrot","Tomatoes","Cucumber","Avocado","Corn","Pumpkin"],
  Summer:     ["Courgette","Capsicum","Tomatoes","Cherry tomatoes","Corn","Cucumber","Eggplant","Beans","Green beans","Peas","Spinach","Lettuce","Rocket","Zucchini flowers","Basil"],
  Autumn:     ["Pumpkin","Butternut squash","Kumara","Carrot","Beetroot","Broccoli","Broccolini","Cauliflower","Cabbage","Silverbeet","Kale","Leek","Mushrooms","Shiitake","Capsicum","Feijoa","Parsnip"],
  Winter:     ["Kumara","Pumpkin","Parsnip","Carrot","Beetroot","Cauliflower","Cabbage","Savoy cabbage","Kale","Brussels sprouts","Broccoli","Leek","Silverbeet","Spinach","Onion","Spring onion","Celeriac"],
  Spring:     ["Asparagus","Peas","Snap peas","Broad beans","Beans","Spinach","Baby spinach","Lettuce","Radish","Spring onion","Courgette","Broccolini","Fennel","Artichoke"],
};

const PANTRY_STAPLES = ["Olive oil","Garlic","Salt & pepper","Onion","Soy sauce","Butter","Lemon"];

const TYPEAHEAD_INGREDIENTS = [
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

const MOCK_MEALS = [
  { id:1, name:"Spaghetti Carbonara", emoji:"🍝", description:"Silky, indulgent pasta with crispy pancetta and a rich egg sauce.", time:"25 mins", difficulty:"Easy", calories:520, ingredients:["200g spaghetti","100g pancetta","2 large eggs + 1 yolk","50g pecorino"], pantryUsed:["2 cloves garlic","1 tsp salt & pepper","1 tbsp olive oil"], macros:{protein:28,carbs:42,fat:30}, method:["Boil spaghetti in salted water until al dente. Reserve a mug of pasta water.","Fry pancetta until crispy. Add garlic for the last minute, remove from heat.","Whisk eggs, yolk, and most of the cheese. Season generously with black pepper.","Toss hot pasta with pancetta off the heat. Add egg mix and toss fast with pasta water until silky.","Serve with remaining cheese and a crack of pepper."] },
  { id:2, name:"Chicken Stir Fry", emoji:"🥢", description:"Fast, saucy and punchy — glossy chicken with crisp veg over steamed rice.", time:"20 mins", difficulty:"Easy", calories:410, ingredients:["2 chicken breasts, sliced","Broccoli & capsicum","Rice to serve"], pantryUsed:["3 tbsp soy sauce","2 cloves garlic","1 tbsp olive oil","1 tsp salt & pepper"], macros:{protein:38,carbs:35,fat:27}, method:["Mix soy sauce, garlic and a splash of sesame oil in a bowl.","Heat a wok until very hot. Cook chicken in batches until golden.","Add broccoli, stir fry 3 mins. Add capsicum and toss.","Pour over sauce, cook 1–2 mins until coated and glossy.","Serve over rice."] },
  { id:3, name:"Halloumi Wraps", emoji:"🫓", description:"Golden, squeaky halloumi with creamy avocado and a chilli kick.", time:"15 mins", difficulty:"Easy", calories:480, ingredients:["250g halloumi, sliced","4 flour tortillas","1 avocado","Cherry tomatoes","Mixed leaves"], pantryUsed:["1 tbsp olive oil","½ lemon, juiced","1 tsp salt & pepper"], macros:{protein:22,carbs:38,fat:40}, method:["Slice halloumi into 1cm planks. Heat a dry griddle until hot.","Cook halloumi 2 mins each side until golden.","Warm tortillas in a dry pan or microwave.","Mash avocado with lemon and salt. Spread over each wrap.","Layer leaves, tomatoes, halloumi. Fold and serve."] },
];

// ─── PROMPT ───────────────────────────────────────────────────────────────────
function buildPrompt(prefs) {
  const proteins = prefs.proteins.includes("Any") ? "any protein" : prefs.proteins.join(", ");
  const carbs    = prefs.carbs.includes("Any") ? "any carbs" : prefs.carbs.join(", ");
  const veg      = prefs.veg.includes("Any") ? `any seasonal NZ ${prefs.season} vegetables` : prefs.veg.join(", ");
  const cuisineNote  = prefs.cuisine && prefs.cuisine !== "Any" ? `- Cuisine: ${prefs.cuisine} — all 3 meals must be ${prefs.cuisine} style` : "";
  const macroNote    = prefs.macros ? `- Macro target: ${prefs.macros.protein}% protein, ${prefs.macros.carbs}% carbs, ${prefs.macros.fat}% fat` : "";
  const freeTextNote = prefs.freeText?.trim() ? `- Extra instructions: ${prefs.freeText.trim()}` : "";
  return `You are a meal planning assistant for New Zealand home cooks. It is ${prefs.season} in NZ.
User wants dinner tonight:
- Protein: ${proteins}
- Carbs: ${carbs}
- Vegetables: ${veg}
- Calories per serving: ~${prefs.calories} kcal
- Servings: ${prefs.people}
${cuisineNote}
${macroNote}
${freeTextNote}
Assume pantry staples: olive oil, garlic, salt, pepper, onion, soy sauce, butter, lemon.
Generate exactly 3 weeknight dinner ideas. Respond ONLY with valid JSON array, no markdown:
[{"name":"","emoji":"","description":"One punchy sentence 10-15 words selling the dish.","time":"X mins","difficulty":"Easy","calories":500,"ingredients":["quantity + ingredient"],"pantryUsed":["2 tbsp olive oil"],"macros":{"protein":30,"carbs":40,"fat":30},"method":["Step."]}]
Rules: ingredients 4-6 hero items scaled to ${prefs.people} serving(s), pantryUsed with quantities, method 4-5 steps, all 3 meals distinct.`;
}

// ─── SHARED ATOMS ─────────────────────────────────────────────────────────────
const label11 = { ...T.tiny, fontWeight:"700", letterSpacing:"0.1em", textTransform:"uppercase", color:C.muted };
const divider = { borderTop:`1px solid ${C.strokeStrong}`, paddingTop:`${SPACE.s}px`, marginBottom:`${SPACE.s}px` };

function SectionLabel({ children }) {
  return <div style={{ ...divider, ...T.small, fontWeight:"700", color:C.dark, marginBottom:`${SPACE.s}px` }}>{children}</div>;
}

function Chip({ label, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      display:"flex", flexDirection:"row",
      justifyContent:"center", alignItems:"center",
      padding:`${SPACE.xs}px ${SPACE.s}px`,
      gap:`${SPACE.xs}px`,
      height:"36px", flexShrink:0,
      background: selected ? C.primary : C.background,
      border:`1px solid ${selected ? C.primary : C.strokeStrong}`,
      borderRadius:"32px",
      cursor:"pointer", transition:"all 0.15s",
    }}>
      <span style={{
        ...T.tiny,
        color: C.textStrong,
        textAlign:"center",
        whiteSpace:"nowrap",
      }}>{label}</span>
    </button>
  );
}

// ─── STEPPER ICONS (top-level so accessible in design system) ────────────────
const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="11" y="3" width="2" height="18" rx="1" fill={C.textStrong}/>
    <rect x="3" y="11" width="18" height="2" rx="1" fill={C.textStrong}/>
  </svg>
);

const MinusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="11" width="18" height="2" rx="1" fill={C.textStrong}/>
  </svg>
);

function Stepper({ value, onChange }) {
  const btnBase = {
    display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",
    padding:"10px", gap:"10px", width:"44px", height:"40px",
    background:C.fill, border:`1px solid ${C.border}`,
    cursor:"pointer", position:"relative", flexShrink:0,
  };

  return (
    <div style={{ display:"flex", flexDirection:"row", alignItems:"flex-start", width:"120px", height:"40px" }}>
      <button onClick={()=>onChange(Math.max(1,value-1))} style={{ ...btnBase, borderRadius:"48px 0px 0px 48px" }}>
        <MinusIcon/>
      </button>
      <div style={{
        display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",
        padding:"10px", width:"31px", height:"40px", flexShrink:0,
        background:C.white, borderWidth:"1px 0px", borderStyle:"solid", borderColor:C.border,
        borderRadius:"0px",
      }}>
        <span style={{ fontSize:"15px", fontWeight:"700", color:C.dark, fontFamily:F, lineHeight:1 }}>{value}</span>
      </div>
      <button onClick={()=>onChange(Math.min(8,value+1))} style={{ ...btnBase, borderRadius:"0px 48px 48px 0px" }}>
        <PlusIcon/>
      </button>
    </div>
  );
}

// ─── MACRO BAR ────────────────────────────────────────────────────────────────
function MacroBar({ protein, carbs, fat, calories, size="sm" }) {
  const h = size === "lg" ? "6px" : "4px";
  const fs = size === "lg" ? "12px" : "11px";
  const toG = (pct, k) => Math.round((pct/100)*calories/k);
  const showG = !!calories;
  const items = showG
    ? [["P", toG(protein,4), "g", "#7BB8F0"], ["C", toG(carbs,4), "g", C.lime], ["F", toG(fat,9), "g", "#F0A87B"]]
    : [["P", protein, "%", "#7BB8F0"], ["C", carbs, "%", C.lime], ["F", fat, "%", "#F0A87B"]];
  return (
    <div>
      <div style={{ display:"flex", height:h, borderRadius:"4px", overflow:"hidden", gap:"1px" }}>
        <div style={{ width:`${protein}%`, background:"#7BB8F0" }}/>
        <div style={{ width:`${carbs}%`,   background:C.lime }}/>
        <div style={{ width:`${fat}%`,     background:"#F0A87B" }}/>
      </div>
      <div style={{ display:"flex", gap:"12px", marginTop:"6px" }}>
        {items.map(([l,v,u,col]) => (
          <div key={l} style={{ display:"flex", alignItems:"center", gap:"4px" }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:col }}/>
            <span style={{ fontSize:fs, color:C.muted, fontFamily:F }}>{l} <strong style={{ color:C.dark }}>{v}{u}</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CALORIE SLIDER ───────────────────────────────────────────────────────────
function CalorieSlider({ value, onChange }) {
  const min=200, max=900;
  const pct = ((value-min)/(max-min))*100;
  const lbl = value<=350?"Light":value<=550?"Medium":value<=750?"Hearty":"Feast";
  const lc  = value<=350?"#6BAE8A":value<=550?C.dark:value<=750?"#C47B2B":"#B94040";
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"14px" }}>
        <div><span style={{ fontSize:"32px", fontWeight:"700", color:C.dark, fontFamily:F }}>{value}</span><span style={{ fontSize:"14px", color:C.muted, fontFamily:F, marginLeft:"4px" }}>kcal</span></div>
        <span style={{ fontSize:"13px", fontWeight:"700", color:lc, fontFamily:F }}>{lbl}</span>
      </div>
      <div style={{ position:"relative", height:"4px", borderRadius:"4px", background:C.border, marginBottom:"12px" }}>
        <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${pct}%`, background:C.dark, borderRadius:"4px" }}/>
        <input type="range" min={min} max={max} step={25} value={value} onChange={e=>onChange(Number(e.target.value))} style={{ position:"absolute", top:"50%", left:0, transform:"translateY(-50%)", width:"100%", opacity:0, cursor:"pointer", height:"28px", margin:0 }}/>
        <div style={{ position:"absolute", top:"50%", left:`${pct}%`, transform:"translate(-50%,-50%)", width:"22px", height:"22px", borderRadius:"50%", background:C.dark, border:`3px solid ${C.bg}`, boxShadow:"0 1px 4px rgba(0,0,0,0.15)", pointerEvents:"none" }}/>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:"11px", color:C.muted, fontFamily:F }}>200 kcal</span>
        <div style={{ display:"flex", gap:"8px" }}>
          {[-1,+1].map(d => (
            <div key={d} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"2px" }}>
              <button onClick={()=>onChange(Math.min(max,Math.max(min,value+d*25)))} style={{ width:30, height:30, borderRadius:"50%", border:`1.5px solid ${C.border}`, background:"transparent", fontSize:"16px", cursor:"pointer", color:C.dark, display:"flex", alignItems:"center", justifyContent:"center" }}>{d<0?"−":"+"}</button>
              <span style={{ fontSize:"9px", color:C.muted, fontFamily:F }}>25 kcal</span>
            </div>
          ))}
        </div>
        <span style={{ fontSize:"11px", color:C.muted, fontFamily:F }}>900 kcal</span>
      </div>
    </div>
  );
}

// ─── MACRO SELECTOR ───────────────────────────────────────────────────────────
const MACRO_PRESETS = [
  { name:"Balanced",     protein:30, carbs:40, fat:30 },
  { name:"High Protein", protein:45, carbs:30, fat:25 },
  { name:"Low Carb",     protein:35, carbs:20, fat:45 },
  { name:"Keto",         protein:25, carbs:5,  fat:70 },
  { name:"High Carb",    protein:20, carbs:55, fat:25 },
  { name:"Low Fat",      protein:40, carbs:45, fat:15 },
];
const DEFAULT_MACROS = { protein:30, carbs:40, fat:30 };

function MacroSelector({ value, onChange }) {
  const macros = value || DEFAULT_MACROS;
  const adjust = (key, dir) => {
    const nv = Math.min(90, Math.max(5, macros[key]+dir*5));
    const diff = nv - macros[key]; if (!diff) return;
    const others = Object.keys(macros).filter(k=>k!==key);
    const ot = others.reduce((s,k)=>s+macros[k],0);
    let u = { ...macros, [key]:nv };
    if (ot>0) others.forEach(k=>{ u[k]=Math.max(5,Math.round(macros[k]-diff*(macros[k]/ot))); });
    const t = Object.values(u).reduce((s,v)=>s+v,0), d2=100-t;
    if (d2) { const fk=others.find(k=>u[k]+d2>=5)||others[0]; u[fk]=Math.max(5,u[fk]+d2); }
    onChange(u);
  };
  const MS = ({ label, k, color }) => (
    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:`${SPACE.xs}px` }}>
      <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
        <div style={{ width:8, height:8, borderRadius:"50%", background:color }}/>
        <span style={{ fontSize:"10px", fontWeight:"700", color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", fontFamily:F }}>{label}</span>
      </div>
      <span style={{ fontSize:"22px", fontWeight:"700", color:C.dark, fontFamily:F }}>{macros[k]}%</span>
      <div style={{ display:"flex", gap:`${SPACE.xs}px` }}>
        {[-1,+1].map(d=><button key={d} onClick={()=>adjust(k,d)} style={{ width:26, height:26, borderRadius:"50%", border:`1.5px solid ${C.border}`, background:"transparent", fontSize:"14px", cursor:"pointer", color:C.dark, display:"flex", alignItems:"center", justifyContent:"center" }}>{d<0?"−":"+"}</button>)}
      </div>
    </div>
  );
  return (
    <div>
      <div style={{ ...label11, marginBottom:"12px" }}>⚖️ Macro ratio</div>
      <div style={{ display:"flex", gap:"8px", overflowX:"auto", paddingBottom:"10px" }}>
        {MACRO_PRESETS.map(p => {
          const sel = macros.protein===p.protein&&macros.carbs===p.carbs&&macros.fat===p.fat;
          return <button key={p.name} onClick={()=>onChange({protein:p.protein,carbs:p.carbs,fat:p.fat})} style={{ padding:"6px 14px", borderRadius:"100px", flexShrink:0, border:`1.5px solid ${sel?C.dark:C.border}`, background:sel?C.dark:"transparent", color:sel?C.white:C.dark, fontSize:"12px", fontFamily:F, fontWeight:sel?"700":"400", cursor:"pointer", whiteSpace:"nowrap" }}>{p.name}</button>;
        })}
      </div>
      <div style={{ background:C.white, borderRadius:"16px", padding:"16px", border:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", gap:"8px", marginBottom:`${SPACE.s}px` }}>
          <MS label="Protein" k="protein" color="#7BB8F0"/>
          <div style={{ width:"1px", background:C.border }}/>
          <MS label="Carbs"   k="carbs"   color={C.lime}/>
          <div style={{ width:"1px", background:C.border }}/>
          <MS label="Fat"     k="fat"     color="#F0A87B"/>
        </div>
        <MacroBar protein={macros.protein} carbs={macros.carbs} fat={macros.fat}/>
      </div>
    </div>
  );
}

// ─── TYPE-AHEAD INPUT ─────────────────────────────────────────────────────────
// ─── SEARCH ICON ──────────────────────────────────────────────────────────────
const SearchIcon = ({ color = C.textStrong }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M11 11L14 14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ─── TYPE-AHEAD INPUT ─────────────────────────────────────────────────────────
function TypeAheadInput({ placeholder, selectedItems, onAdd }) {
  const [val, setVal] = useState("");
  const confirm = (item) => { const v=(item||val).trim(); if(!v)return; onAdd(v); setVal(""); };
  const sugg = val.trim().length>=2 ? TYPEAHEAD_INGREDIENTS.filter(s=>s.toLowerCase().includes(val.toLowerCase())&&!selectedItems.includes(s)).slice(0,5) : [];
  return (
    <div style={{ position:"relative" }}>
      {/* Field — exact Figma spec: 40px height, S/XS padding, strokeStrong border, 32px radius */}
      <div style={{
        display:"flex", flexDirection:"row", alignItems:"center",
        padding:`${SPACE.xs}px ${SPACE.s}px`,
        gap:`${SPACE.xs}px`,
        height:"40px",
        background:C.background,
        border:`1px solid ${C.strokeStrong}`,
        borderRadius:"32px",
      }}>
        {/* Leading icon — 24×24 container, 16×16 vector */}
        <div style={{ width:24, height:24, display:"flex", justifyContent:"center", alignItems:"center", flexShrink:0 }}>
          <SearchIcon color={C.textStrong}/>
        </div>
        <input
          value={val}
          onChange={e=>setVal(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter")confirm(); if(e.key==="Escape")setVal(""); }}
          placeholder={placeholder}
          style={{
            flex:1, border:"none", outline:"none", background:"transparent",
            ...T.tiny, color:C.textStrong,
          }}
        />
        {val.trim() && (
          <button onClick={()=>confirm()} style={{ width:24, height:24, borderRadius:"50%", background:C.textStrong, border:"none", color:C.primary, fontSize:"12px", cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>✓</button>
        )}
      </div>
      {/* Suggestions dropdown */}
      {sugg.length>0 && (
        <div style={{ position:"absolute", left:0, right:0, top:"100%", zIndex:20, background:C.background, border:`1px solid ${C.strokeStrong}`, borderRadius:"16px", marginTop:`${SPACE.xxs}px`, overflow:"hidden", boxShadow:C.shadow }}>
          {sugg.map(s=>(
            <button key={s} onClick={()=>confirm(s)}
              style={{ width:"100%", padding:`${SPACE.xs}px ${SPACE.s}px`, background:"none", border:"none", borderBottom:`1px solid ${C.strokeWeak}`, cursor:"pointer", textAlign:"left", ...T.tiny, color:C.textStrong }}
              onMouseEnter={e=>e.currentTarget.style.background=C.fill}
              onMouseLeave={e=>e.currentTarget.style.background="none"}
            >{s}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── CATEGORY CHIP SELECTOR ───────────────────────────────────────────────────
function CategoryChipSelector({ icon, label, categories, selected, onChange }) {
  const cats = Object.keys(categories);
  const [active, setActive] = useState(cats[0]);
  const sel = selected.filter(s=>s!=="Any");
  const toggle = (item) => {
    if(item==="No carbs"){onChange(["No carbs"]);return;}
    const without=sel.filter(s=>s!=="No carbs"&&s!=="Any");
    const next=without.includes(item)?without.filter(s=>s!==item):[...without,item];
    onChange(next.length===0?["Any"]:next);
  };
  const items = categories[active]?.items||[];
  return (
    <div>
      <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:`${SPACE.xs}px` }}>
        <div style={{ ...T.small, fontWeight:"700", color:C.textStrong }}>{label}</div>
        {sel.length>0 && <button onClick={()=>onChange(["Any"])} style={{ background:"none", border:"none", cursor:"pointer", ...T.tiny, color:C.muted, fontFamily:F, textDecoration:"underline" }}>Clear</button>}
      </div>
      {/* Category tabs */}
      <div style={{ display:"flex", gap:`${SPACE.xs}px`, overflowX:"auto", paddingBottom:`${SPACE.xs}px` }}>
        {cats.map(cat => (
          <CategoryTab
            key={cat}
            label={cat}
            icon={(isActive) => categories[cat].icon(isActive)}
            active={active===cat}
            onClick={()=>setActive(cat)}
          />
        ))}
      </div>
      {/* Unified chip container */}
      <div style={{
        display:"flex", flexDirection:"column",
        background:C.fill,
        border:`1px solid ${C.strokeStrong}`,
        borderRadius:"16px",
        boxShadow:SHADOW.overlay,
        overflow:"hidden",
      }}>
        {/* Pills */}
        <div style={{
          display:"flex", flexDirection:"row", flexWrap:"wrap",
          alignItems:"flex-start", alignContent:"flex-start",
          padding:`${SPACE.m}px ${SPACE.s}px`,
          gap:`${SPACE.xs}px`,
        }}>
          {items.map(item=>{
            const isS=sel.includes(item);
            return (
              <button key={item} onClick={()=>toggle(item)} style={{
                display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center",
                padding:`${SPACE.xs}px ${SPACE.s}px`, gap:`${SPACE.xs}px`,
                height:"36px", borderRadius:"32px", cursor:"pointer",
                border:`1px solid ${isS?C.primary:C.strokeStrong}`,
                background:isS?C.primary:C.background,
                transition:"all 0.12s",
              }}>
                <span style={{ ...T.tiny, color:C.textStrong, whiteSpace:"nowrap" }}>{item}</span>
              </button>
            );
          })}
        </div>
        {/* Search — no top border, padding S sides and bottom */}
        <div style={{ padding:`0px ${SPACE.s}px ${SPACE.s}px` }}>
          <TypeAheadInput placeholder={`Search ${active.toLowerCase()}...`} selectedItems={sel} onAdd={v=>{const w=sel.filter(s=>s!=="Any"&&s!=="No carbs");onChange([...w,v]);}}/>
        </div>
      </div>
    </div>
  );
}

// ─── VEG SELECTOR ─────────────────────────────────────────────────────────────
function VegSelector({ season, onSeasonChange, selected, onChange }) {
  const [tab, setTab] = useState("All year");
  const sel = selected.filter(s=>s!=="Any");
  const handleTab = (t) => { setTab(t); if(t!=="All year") onSeasonChange(t); };
  const toggle = (v) => { const next=sel.includes(v)?sel.filter(s=>s!==v):[...sel,v]; onChange(next.length===0?["Any"]:next); };
  const tabs = ["All year",...SEASONS];
  const veg = SEASONAL_VEG[tab]||[];
  return (
    <div>
      <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:`${SPACE.xs}px` }}>
        <div style={{ ...T.small, fontWeight:"700", color:C.textStrong }}>Vegetables</div>
        {sel.length>0 && <button onClick={()=>onChange(["Any"])} style={{ background:"none", border:"none", cursor:"pointer", ...T.tiny, color:C.muted, fontFamily:F, textDecoration:"underline" }}>Clear</button>}
      </div>
      {/* Season tabs */}
      <div style={{ display:"flex", gap:`${SPACE.xs}px`, overflowX:"auto", paddingBottom:`${SPACE.xs}px` }}>
        {tabs.map(t => {
          const emoji = t==="All year" ? "🌿" : SEASON_EMOJI[t];
          return (
            <CategoryTab
              key={t}
              label={t}
              icon={(isActive) => (
                <span style={{ fontSize:"18px", filter: isActive ? "brightness(10)" : "none" }}>
                  {emoji}
                </span>
              )}
              active={tab===t}
              onClick={()=>handleTab(t)}
            />
          );
        })}
      </div>
      {/* Unified chip container */}
      <div style={{
        display:"flex", flexDirection:"column",
        background:C.fill,
        border:`1px solid ${C.strokeStrong}`,
        borderRadius:"16px",
        boxShadow:SHADOW.overlay,
        overflow:"hidden",
      }}>
        {/* Pills */}
        <div style={{
          display:"flex", flexDirection:"row", flexWrap:"wrap",
          alignItems:"flex-start", alignContent:"flex-start",
          padding:`${SPACE.m}px ${SPACE.s}px`,
          gap:`${SPACE.xs}px`,
        }}>
          {veg.map(v=>{
            const isS=sel.includes(v);
            return (
              <button key={v} onClick={()=>toggle(v)} style={{
                display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center",
                padding:`${SPACE.xs}px ${SPACE.s}px`, gap:`${SPACE.xs}px`,
                height:"36px", borderRadius:"32px", cursor:"pointer",
                border:`1px solid ${isS?C.primary:C.strokeStrong}`,
                background:isS?C.primary:C.background,
                transition:"all 0.12s",
              }}>
                <span style={{ ...T.tiny, color:C.textStrong, whiteSpace:"nowrap" }}>{v}</span>
              </button>
            );
          })}
        </div>
        {/* Search */}
        <div style={{ padding:`0px ${SPACE.s}px ${SPACE.s}px` }}>
          <TypeAheadInput placeholder="Search vegetables..." selectedItems={sel} onAdd={v=>{const w=sel.filter(s=>s!=="Any");onChange([...w,v]);}}/>
        </div>
      </div>
    </div>
  );
}

// ─── ADD CONTEXT COMPONENT ────────────────────────────────────────────────────
const AddIcon = () => (
  <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 10.6667H0V8H8V0H10.6667V8H18.6667V10.6667H10.6667V18.6667H8V10.6667Z" fill={C.textWeak}/>
  </svg>
);

const RecordIcon = () => (
  <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.83333 10C5.13889 10 4.54861 9.75694 4.0625 9.27083C3.57639 8.78472 3.33333 8.19444 3.33333 7.5V2.5C3.33333 1.80556 3.57639 1.21528 4.0625 0.729167C4.54861 0.243056 5.13889 0 5.83333 0C6.52778 0 7.11806 0.243056 7.60417 0.729167C8.09028 1.21528 8.33333 1.80556 8.33333 2.5V7.5C8.33333 8.19444 8.09028 8.78472 7.60417 9.27083C7.11806 9.75694 6.52778 10 5.83333 10ZM5 15.8333V13.2708C3.55556 13.0764 2.36111 12.4306 1.41667 11.3333C0.472222 10.2361 0 8.95833 0 7.5H1.66667C1.66667 8.65278 2.07292 9.63542 2.88542 10.4479C3.69792 11.2604 4.68056 11.6667 5.83333 11.6667C6.98611 11.6667 7.96875 11.2604 8.78125 10.4479C9.59375 9.63542 10 8.65278 10 7.5H11.6667C11.6667 8.95833 11.1944 10.2361 10.25 11.3333C9.30556 12.4306 8.11111 13.0764 6.66667 13.2708V15.8333H5ZM5.83333 8.33333C6.06944 8.33333 6.26736 8.25347 6.42708 8.09375C6.58681 7.93403 6.66667 7.73611 6.66667 7.5V2.5C6.66667 2.26389 6.58681 2.06597 6.42708 1.90625C6.26736 1.74653 6.06944 1.66667 5.83333 1.66667C5.59722 1.66667 5.39931 1.74653 5.23958 1.90625C5.07986 2.06597 5 2.26389 5 2.5V7.5C5 7.73611 5.07986 7.93403 5.23958 8.09375C5.39931 8.25347 5.59722 8.33333 5.83333 8.33333Z" fill="#665838"/>
  </svg>
);

const SubmitIcon = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 13C0 5.8203 5.8203 0 13 0V0C20.1797 0 26 5.8203 26 13V13C26 20.1797 20.1797 26 13 26V26C5.8203 26 0 20.1797 0 13V13Z" fill="#665838"/>
    <path d="M13.948 9.04249L13.948 20.5834L12.0522 20.5834L12.0522 9.04249L6.74383 14.3508L5.41675 13L13.0001 5.41671L20.5834 13L19.2563 14.3508L13.948 9.04249Z" fill="white"/>
  </svg>
);

function AddContext({ value: controlledValue, onChange, onAdd, placeholder="Any context? (leftovers, mood…)" }) {
  const [internalValue, setInternalValue] = useState("");
  const [focused, setFocused]             = useState(false);
  const textareaRef                        = useRef(null);

  const isControlled = controlledValue !== undefined;
  const value        = isControlled ? controlledValue : internalValue;

  // Auto-resize textarea height to fit content
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    if (!value) { el.style.height = "20px"; }
    else        { el.style.height = "auto"; el.style.height = `${el.scrollHeight}px`; }
  }, [value]);

  const handleChange = (e) => {
    if (!isControlled) setInternalValue(e.target.value);
    if (typeof onChange === "function") onChange(e.target.value);
  };

  const handleAdd = () => {
    if (typeof onAdd === "function") onAdd(value);
    if (!isControlled) setInternalValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAdd(); }
  };

  return (
    <div style={{ display:"flex", flexDirection:"row", alignItems:"flex-start", padding:0, gap:`${SPACE.xs}px`, width:"100%" }}>
      {/* Add button */}
      <button onClick={handleAdd} aria-label="Add context" style={{
        boxSizing:"border-box", width:36, height:36, flexShrink:0,
        background:C.background, border:`1px solid ${C.strokeStrong}`,
        borderRadius:"48px", display:"flex", alignItems:"center",
        justifyContent:"center", cursor:"pointer", padding:0,
        transition:"background 0.15s, border-color 0.15s",
      }}
        onMouseEnter={e=>{e.currentTarget.style.background=C.fill;e.currentTarget.style.borderColor=C.textWeak;}}
        onMouseLeave={e=>{e.currentTarget.style.background=C.background;e.currentTarget.style.borderColor=C.strokeStrong;}}
      ><AddIcon/></button>

      {/* Growing text field */}
      <div style={{
        boxSizing:"border-box", display:"flex", flexDirection:"row", alignItems:"center",
        padding:`${SPACE.xs}px 42px ${SPACE.xs}px ${SPACE.s}px`,
        flex:1, minHeight:"36px", position:"relative",
        background:C.background,
        border:`1px solid ${focused ? C.textWeak : C.strokeStrong}`,
        borderRadius:"32px", transition:"border-color 0.15s",
      }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onFocus={()=>setFocused(true)}
          onBlur={()=>setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          style={{
            flex:1, border:"none", outline:"none", background:"transparent",
            resize:"none", overflow:"hidden", ...T.tiny, color:C.textStrong,
            minWidth:0, padding:0, margin:0, lineHeight:"20px", height:"20px",
            display:"block", verticalAlign:"middle",
          }}
        />
        {/* Mic when empty, submit arrow when typing */}
        {value ? (
          <button onClick={handleAdd} aria-label="Submit" style={{
            position:"absolute", right:"5px", top:"50%", transform:"translateY(-50%)",
            width:26, height:26, border:"none", background:"transparent",
            display:"flex", alignItems:"center", justifyContent:"center",
            cursor:"pointer", padding:0,
          }}><SubmitIcon/></button>
        ) : (
          <button aria-label="Record voice input" style={{
            position:"absolute", right:"11px", top:"50%", transform:"translateY(-50%)",
            width:20, height:20, border:"none", background:"transparent",
            display:"flex", alignItems:"center", justifyContent:"center",
            cursor:"pointer", padding:0,
          }}><RecordIcon/></button>
        )}
      </div>
    </div>
  );
}

// ─── SCREEN 1: INPUT ──────────────────────────────────────────────────────────
function InputScreen({ onGenerate, isLoading, onShowDS }) {
  const [season, setSeason]           = useState(CURRENT_SEASON);
  const [proteins, setProteins]       = useState(["Any"]);
  const [carbs, setCarbs]             = useState(["Any"]);
  const [veg, setVeg]                 = useState(["Any"]);
  const [calories, setCalories]       = useState(500);
  const [macros, setMacros]           = useState(DEFAULT_MACROS);
  const [people, setPeople]           = useState(2);
  const [freeNotes, setFreeNotes]     = useState([]);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleSeasonChange = (s) => { setSeason(s); setVeg(["Any"]); };
  const removeFreeNote = (i) => setFreeNotes(prev => prev.filter((_,idx) => idx !== i));

  const summary = () => {
    const p=[]; 
    if(!proteins.includes("Any")) p.push(proteins.join(", "));
    if(!carbs.includes("Any")) p.push(carbs.join(", "));
    if(!veg.includes("Any")) p.push(veg.join(", "));
    return p.length?p.join(" · "):null;
  };

  return (
    <div style={{ padding:"0 0 220px" }}>
      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        *{box-sizing:border-box} ::-webkit-scrollbar{display:none} input:focus,textarea:focus{outline:none}
      `}</style>

      {/* Header */}
      <div style={{ padding:`${SPACE.xxl}px ${SPACE.s}px ${SPACE.m}px` }}>
        <div style={{ display:"flex", alignItems:"center", gap:`${SPACE.xs}px`, marginBottom:`${SPACE.s}px`, flexWrap:"wrap" }}>
          <div style={{ display:"inline-flex", alignItems:"center", background:C.lime, borderRadius:"100px", padding:"5px 14px" }}>
            <span style={{ fontSize:"12px", fontWeight:"700", color:C.dark, fontFamily:F }}>✦ AI powered meal generator</span>
          </div>
          <button onClick={onShowDS} style={{ display:"inline-flex", alignItems:"center", background:"transparent", border:`1px solid ${C.border}`, borderRadius:"100px", padding:"5px 14px", cursor:"pointer" }}>
            <span style={{ fontSize:"12px", fontWeight:"700", color:C.dark, fontFamily:F }}>⬡ Design system</span>
          </button>
        </div>
        <h1 style={{ ...T.h1, color:C.dark, margin:0 }}>
          What's for<br/>dinner tonight?
        </h1>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>

        {/* Servings */}
        <div style={{ padding:"0 20px" }}>
          <SectionLabel>How many servings?</SectionLabel>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:`${SPACE.m}px` }}>
            <Stepper value={people} onChange={setPeople}/>
            <span style={{ fontSize:"13px", color:C.muted, fontFamily:F }}>
              {people===1?"Just me":people===2?"Two of us":`${people} people`}
            </span>
          </div>
        </div>

        {/* Protein */}
        <div style={{ padding:`0 ${SPACE.s}px`, marginBottom:`${SPACE.m}px` }}>
          <CategoryChipSelector label="Protein" categories={PROTEIN_CATEGORIES} selected={proteins} onChange={setProteins}/>
        </div>

        {/* Carbs */}
        <div style={{ padding:`0 ${SPACE.s}px`, marginBottom:`${SPACE.m}px` }}>
          <CategoryChipSelector label="Carbs" categories={CARB_CATEGORIES} selected={carbs} onChange={setCarbs}/>
        </div>

        {/* Veg */}
        <div style={{ padding:`0 ${SPACE.s}px`, marginBottom:`${SPACE.m}px` }}>
          <VegSelector season={season} onSeasonChange={handleSeasonChange} selected={veg} onChange={setVeg}/>
        </div>

        {/* Calorie & macro accordion */}
        <div style={{ padding:"0 20px" }}>
          <button onClick={()=>setDetailsOpen(o=>!o)} style={{
            width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
            background:"none", border:"none", cursor:"pointer", borderTop:`1px solid ${C.border}`,
            paddingTop:"20px", paddingBottom: detailsOpen?"16px":"20px",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
              <span style={{ fontSize:"15px", fontWeight:"700", color:C.dark, fontFamily:F }}>Calorie and macro details</span>
              {!detailsOpen && <span style={{ fontSize:"12px", color:C.muted, fontFamily:F }}>{calories} kcal · {macros.protein}P/{macros.carbs}C/{macros.fat}F</span>}
            </div>
            <span style={{ fontSize:"12px", color:C.muted, transition:"transform 0.2s", display:"inline-block", transform:detailsOpen?"rotate(180deg)":"rotate(0deg)" }}>▼</span>
          </button>
          {detailsOpen && (
            <div style={{ display:"flex", flexDirection:"column", gap:`${SPACE.m}px`, paddingBottom:"20px" }}>
              <CalorieSlider value={calories} onChange={setCalories}/>
              <MacroSelector value={macros} onChange={setMacros}/>
            </div>
          )}
        </div>

        {/* Anything else */}
        <div style={{ padding:`0 ${SPACE.s}px`, marginBottom:`${SPACE.m}px` }}>
          <div style={{ ...T.small, fontWeight:"700", color:C.textStrong, borderTop:`1px solid ${C.strokeStrong}`, paddingTop:`${SPACE.s}px`, marginBottom:`${SPACE.s}px` }}>Anything else?</div>
          <AddContext
            onAdd={(note) => { const v = note.trim(); if(v) setFreeNotes(prev=>[...prev, v]); }}
            placeholder="e.g. nothing spicy, use up leftovers, allergic to nuts…"
          />
        </div>
      </div>

      {/* Generate button + consolidated selection pills */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"390px", padding:"12px 20px 32px", background:`linear-gradient(transparent, ${C.bg} 30%)`, zIndex:10 }}>

        {/* Stacked pills — ingredients + free notes */}
        {(proteins.filter(s=>s!=="Any").length>0 || carbs.filter(s=>s!=="Any").length>0 || veg.filter(s=>s!=="Any").length>0 || freeNotes.length>0) && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:`${SPACE.xs}px`, marginBottom:"10px" }}>
            {proteins.filter(s=>s!=="Any").map(item=>(
              <button key={`p-${item}`} onClick={()=>{const next=proteins.filter(s=>s!==item);setProteins(next.length===0?["Any"]:next);}}
                style={{ padding:"5px 11px", borderRadius:"100px", border:"none", background:C.pill, color:C.pillText, fontSize:"12px", fontFamily:F, fontWeight:"600", cursor:"pointer", display:"flex", alignItems:"center", gap:"5px" }}>
                {item} <span style={{ opacity:0.5, fontSize:"10px" }}>✕</span>
              </button>
            ))}
            {carbs.filter(s=>s!=="Any").map(item=>(
              <button key={`c-${item}`} onClick={()=>{const next=carbs.filter(s=>s!==item);setCarbs(next.length===0?["Any"]:next);}}
                style={{ padding:"5px 11px", borderRadius:"100px", border:"none", background:C.pill, color:C.pillText, fontSize:"12px", fontFamily:F, fontWeight:"600", cursor:"pointer", display:"flex", alignItems:"center", gap:"5px" }}>
                {item} <span style={{ opacity:0.5, fontSize:"10px" }}>✕</span>
              </button>
            ))}
            {veg.filter(s=>s!=="Any").map(item=>(
              <button key={`v-${item}`} onClick={()=>{const next=veg.filter(s=>s!==item);setVeg(next.length===0?["Any"]:next);}}
                style={{ padding:"5px 11px", borderRadius:"100px", border:"none", background:C.pill, color:C.pillText, fontSize:"12px", fontFamily:F, fontWeight:"600", cursor:"pointer", display:"flex", alignItems:"center", gap:"5px" }}>
                {item} <span style={{ opacity:0.5, fontSize:"10px" }}>✕</span>
              </button>
            ))}
            {freeNotes.map((note,i)=>(
              <button key={`n-${i}`} onClick={()=>removeFreeNote(i)}
                style={{ padding:"5px 11px", borderRadius:"100px", border:`1.5px solid ${C.border}`, background:"transparent", color:C.dark, fontSize:"12px", fontFamily:F, fontWeight:"600", cursor:"pointer", display:"flex", alignItems:"center", gap:"5px", fontStyle:"italic" }}>
                {note.length>24?note.slice(0,24)+"…":note} <span style={{ opacity:0.5, fontSize:"10px" }}>✕</span>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={()=>onGenerate({season,proteins,carbs,veg,calories,macros,people,freeText:freeNotes.join(". ")})}
          disabled={isLoading}
          style={{
            width:"100%", padding:"18px", borderRadius:"100px", border:"none",
            background:isLoading?C.muted:C.lime,
            color:isLoading?C.white:C.dark,
            fontSize:"16px", fontWeight:"700", fontFamily:F,
            cursor:isLoading?"not-allowed":"pointer",
            display:"flex", alignItems:"center", justifyContent:"center", gap:"10px",
          }}
        >
          {isLoading
            ? <><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>✦</span>Thinking up ideas...</>
            : "✦ Generate meal"
          }
        </button>
      </div>
    </div>
  );
}

// ─── MEAL CARD ────────────────────────────────────────────────────────────────
function MealCard({ meal, featured, onSelect }) {
  return (
    <div style={{ background:C.white, borderRadius:"20px", overflow:"hidden", border:`1.5px solid ${featured?C.lime:C.border}`, boxShadow:featured?`0 0 0 1px ${C.lime}`:C.shadow }}>
      <button onClick={()=>onSelect(meal)} style={{ width:"100%", background:"none", border:"none", cursor:"pointer", textAlign:"left", padding:"20px" }}
        onMouseDown={e=>e.currentTarget.style.opacity="0.8"}
        onMouseUp={e=>e.currentTarget.style.opacity="1"}
      >
        {featured && (
          <div style={{ display:"inline-flex", alignItems:"center", background:C.lime, borderRadius:"100px", padding:"3px 10px", marginBottom:"10px" }}>
            <span style={{ fontSize:"11px", fontWeight:"700", color:C.dark, fontFamily:F }}>✦ Top pick</span>
          </div>
        )}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:"28px", marginBottom:"8px" }}>{meal.emoji}</div>
            <div style={{ ...T.h3, color:C.dark, marginBottom:"4px" }}>{meal.name}</div>
            {meal.description && <div style={{ fontSize:"13px", color:C.muted, fontFamily:F, lineHeight:1.45, marginBottom:"8px" }}>{meal.description}</div>}
            <div style={{ fontSize:"12px", color:C.muted, fontFamily:F, display:"flex", gap:"10px", marginBottom:meal.macros?"10px":"0" }}>
              <span>⏱ {meal.time}</span><span>· {meal.difficulty}</span><span>· 🔥 {meal.calories} kcal</span>
            </div>
            {meal.macros && <MacroBar protein={meal.macros.protein} carbs={meal.macros.carbs} fat={meal.macros.fat} calories={meal.calories}/>}
          </div>
          <div style={{ width:"34px", height:"34px", borderRadius:"50%", background:featured?C.lime:C.bg, border:`1.5px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", flexShrink:0, marginLeft:"12px", color:C.dark }}>→</div>
        </div>
        {/* View recipe CTA */}
        <div style={{ marginTop:"14px", padding:"10px 0 0", borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:"13px", fontWeight:"700", color:C.dark, fontFamily:F }}>View recipe →</span>
        </div>
      </button>
    </div>
  );
}

// ─── SCREEN 2: RESULTS ────────────────────────────────────────────────────────
function ResultsScreen({ prefs, meals, onSelect, onBack, onRegenerate, isLoading }) {
  const [cuisine, setCuisine] = useState("Any");
  const parts = [
    SEASON_EMOJI[prefs.season]+" "+prefs.season,
    !prefs.proteins.includes("Any")&&prefs.proteins.join(", "),
    `${prefs.calories} kcal`,
    `${prefs.people} ${prefs.people===1?"serving":"servings"}`,
  ].filter(Boolean);

  return (
    <div style={{ paddingBottom:"40px" }}>
      <div style={{ padding:`${SPACE.xxl}px ${SPACE.s}px ${SPACE.m}px` }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", padding:"0 0 12px", color:C.muted, fontSize:"14px", fontFamily:F, display:"flex", alignItems:"center", gap:"4px" }}>← Back</button>
        <h2 style={{ ...T.h2, color:C.dark, margin:"0 0 6px" }}>Here's what<br/>you can make</h2>
        <p style={{ color:C.muted, fontSize:"13px", fontFamily:F, margin:0 }}>{parts.join(" · ")}</p>
      </div>

      <div style={{ padding:"0 20px", display:"flex", flexDirection:"column", gap:`${SPACE.xs}px` }}>
        {meals.map((meal,i) => <MealCard key={meal.id} meal={meal} featured={i===0} onSelect={onSelect}/>)}
      </div>

      {/* Cuisine + regenerate */}
      <div style={{ padding:"24px 20px 0" }}>
        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:"20px" }}>
          <div style={{ ...label11, marginBottom:"12px" }}>🍽 Try a cuisine</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:`${SPACE.s}px` }}>
            {["Any","Italian","Asian","Mexican","Middle Eastern","Indian","Japanese","French","American","Mediterranean"].map(c=>(
              <Chip key={c} label={c} selected={cuisine===c} onClick={()=>setCuisine(c)} accent/>
            ))}
          </div>
          <button onClick={()=>onRegenerate(cuisine)} disabled={isLoading}
            style={{
              width:"100%", padding:"16px", borderRadius:"100px",
              border:`1.5px solid ${cuisine!=="Any"?"transparent":C.border}`,
              background:isLoading?C.muted:cuisine!=="Any"?C.dark:"transparent",
              color:isLoading?C.white:cuisine!=="Any"?C.white:C.dark,
              fontSize:"15px", fontWeight:"700", fontFamily:F,
              cursor:isLoading?"not-allowed":"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
            }}
          >
            {isLoading
              ? <><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>✦</span>Finding ideas...</>
              : `↻ ${cuisine!=="Any"?`Regenerate as ${cuisine}`:"Regenerate ideas"}`
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 3: RECIPE ─────────────────────────────────────────────────────────
function RecipeScreen({ meal, onBack }) {
  const all = [...(meal.ingredients||[]),...(meal.pantryUsed||[])];
  const [ingredients, setIngredients] = useState(all);
  const [swapIdx, setSwapIdx]         = useState(null);
  const [swapVal, setSwapVal]         = useState("");
  const [method, setMethod]           = useState(meal.method);
  const [regenLoading, setRegenLoading] = useState(false);
  const [hasEdits, setHasEdits]       = useState(false);
  const [copied, setCopied]           = useState(false);

  const removeIng = (i) => { setIngredients(p=>p.filter((_,idx)=>idx!==i)); setHasEdits(true); if(swapIdx===i)setSwapIdx(null); };
  const startSwap = (i) => { setSwapVal(ingredients[i]); setSwapIdx(i); };
  const confirmSwap = (i) => {
    const v=swapVal.trim(); if(!v){setSwapIdx(null);return;}
    setIngredients(p=>p.map((ing,idx)=>idx===i?v:ing)); setSwapIdx(null); setSwapVal(""); setHasEdits(true);
  };
  const exportIngredients = () => {
    const text=`${meal.name} — Ingredients\n\n${ingredients.join("\n")}`;
    navigator.clipboard.writeText(text).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);}).catch(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);});
  };
  const regenerateMethod = async () => {
    setRegenLoading(true);
    try {
      const r = await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,messages:[{role:"user",content:`You are a cooking assistant. The user modified ingredients for "${meal.name}".\nIngredients: ${ingredients.join(", ")}\nWrite a new method (4-5 steps). Respond ONLY with a JSON array of steps e.g. ["Step one.","Step two."]\nNo explanation, no markdown.`}]})});
      const d=await r.json(); const t=d.content[0].text; const s=JSON.parse(t.replace(/```json|```/g,"").trim()); setMethod(s); setHasEdits(false);
    } catch{}
    finally{setRegenLoading(false);}
  };

  return (
    <div style={{ paddingBottom:"40px" }}>
      {/* Hero */}
      <div style={{ background:C.bg, padding:`${SPACE.xxl}px ${SPACE.s}px ${SPACE.m}px`, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
          <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, fontSize:"14px", fontFamily:F }}>← Back</button>
          <button onClick={exportIngredients} style={{
            display:"flex", alignItems:"center", gap:`${SPACE.xs}px`, padding:"7px 14px", borderRadius:"100px", cursor:"pointer",
            border:`1.5px solid ${copied?"transparent":C.border}`,
            background:copied?C.lime:"transparent",
            color:C.dark, fontSize:"12px", fontFamily:F, fontWeight:"600", transition:"all 0.2s",
          }}>{copied?"✓ Copied!":"↑ Export ingredients"}</button>
        </div>
        <div style={{ fontSize:"44px", marginBottom:"14px" }}>{meal.emoji}</div>
        <h2 style={{ ...T.h2, color:C.dark, margin:"0 0 10px" }}>{meal.name}</h2>
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
          <span style={{ background:C.lime, borderRadius:"100px", padding:"5px 14px", fontSize:"12px", fontWeight:"700", color:C.dark, fontFamily:F }}>⏱ {meal.time}</span>
          <span style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"100px", padding:"5px 14px", fontSize:"12px", color:C.dark, fontFamily:F }}>{meal.difficulty}</span>
          <span style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"100px", padding:"5px 14px", fontSize:"12px", color:C.dark, fontFamily:F }}>🔥 {meal.calories} kcal</span>
        </div>
        {meal.macros && <div style={{ marginTop:"14px" }}><MacroBar protein={meal.macros.protein} carbs={meal.macros.carbs} fat={meal.macros.fat} size="lg" calories={meal.calories}/></div>}
      </div>

      <div style={{ padding:"28px 20px", display:"flex", flexDirection:"column", gap:`${SPACE.m}px` }}>
        {/* Ingredients */}
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:"14px" }}>
            <h3 style={{ ...T.h3, color:C.dark, margin:0 }}>Ingredients</h3>
            <span style={{ fontSize:"11px", color:C.muted, fontFamily:F, fontStyle:"italic" }}>swap or remove</span>
          </div>
          {ingredients.map((ing,i)=>(
            <div key={i}>
              {swapIdx===i ? (
                <div style={{ padding:"10px 0", borderBottom:i<ingredients.length-1?`1px solid ${C.border}`:"none", display:"flex", gap:"8px", alignItems:"center" }}>
                  <input autoFocus value={swapVal} onChange={e=>setSwapVal(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")confirmSwap(i);if(e.key==="Escape")setSwapIdx(null);}}
                    style={{ flex:1, padding:"8px 14px", borderRadius:"100px", border:`1.5px solid ${C.dark}`, background:C.white, fontSize:"14px", fontFamily:F, color:C.dark }}/>
                  <button onClick={()=>confirmSwap(i)} style={{ width:30, height:30, borderRadius:"50%", background:C.dark, border:"none", color:C.lime, fontSize:"14px", cursor:"pointer" }}>✓</button>
                  <button onClick={()=>setSwapIdx(null)} style={{ width:30, height:30, borderRadius:"50%", background:"transparent", border:`1.5px solid ${C.border}`, color:C.muted, fontSize:"12px", cursor:"pointer" }}>✕</button>
                </div>
              ):(
                <div style={{ padding:"13px 0", borderBottom:i<ingredients.length-1?`1px solid ${C.border}`:"none", display:"flex", justifyContent:"space-between", alignItems:"center", gap:"10px" }}>
                  <span style={{ fontSize:"14px", color:C.dark, fontFamily:F, lineHeight:1.4, flex:1 }}>{ing}</span>
                  <div style={{ display:"flex", gap:"8px", flexShrink:0 }}>
                    <button onClick={()=>startSwap(i)} style={{ width:28, height:28, borderRadius:"50%", background:C.lime, border:"none", cursor:"pointer", fontSize:"13px", color:C.dark, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"700" }}>⇄</button>
                    <button onClick={()=>removeIng(i)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"14px", color:C.border, padding:"0" }}>✕</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {hasEdits && (
          <button onClick={regenerateMethod} disabled={regenLoading} style={{ width:"100%", padding:"15px", borderRadius:"100px", border:"none", background:regenLoading?C.muted:C.lime, color:C.dark, fontSize:"14px", fontWeight:"700", fontFamily:F, cursor:regenLoading?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
            {regenLoading?<><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>✦</span>Updating method...</>:"✦ Regenerate method with new ingredients"}
          </button>
        )}

        {/* Method */}
        <div>
          <h3 style={{ ...T.h3, color:C.dark, margin:"0 0 14px" }}>Method</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:`${SPACE.xs}px` }}>
            {method.map((step,i)=>(
              <div key={i} style={{ display:"flex", gap:`${SPACE.xs}px`, alignItems:"flex-start" }}>
                <div style={{ width:"26px", height:"26px", borderRadius:"50%", background:C.lime, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:"700", color:C.dark, fontFamily:F, flexShrink:0, marginTop:"1px" }}>{i+1}</div>
                <p style={{ margin:0, fontSize:"14px", lineHeight:"1.6", color:C.dark, fontFamily:F }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DESIGN SYSTEM SCREEN ─────────────────────────────────────────────────────
function DesignSystemScreen({ onBack }) {
  const [stepVal, setStepVal] = useState(2);
  const [showModal, setShowModal] = useState(false);

  const Section = ({ title, children }) => (
    <div style={{ marginBottom:`${SPACE.xl}px` }}>
      <div style={{ ...T.h3, color:C.dark, borderBottom:`1px solid ${C.strokeStrong}`, paddingBottom:`${SPACE.xs}px`, marginBottom:`${SPACE.m}px` }}>{title}</div>
      {children}
    </div>
  );

  return (
    <div style={{ padding:`${SPACE.xxl}px ${SPACE.s}px ${SPACE.xl}px`, background:C.bg, minHeight:"100vh", position:"relative" }}>

      {/* Modal overlay */}
      {showModal && (
        <div style={{
          position:"fixed", inset:0, zIndex:100,
          background:"rgba(61,51,26,0.4)",
          display:"flex", alignItems:"flex-end",
          justifyContent:"center",
        }} onClick={()=>setShowModal(false)}>
    <div onClick={e=>e.stopPropagation()} style={{
        width:"390px", maxHeight:"90vh", overflowY:"auto",
        background:C.bg, borderRadius:"24px 24px 0 0",
        padding:`${SPACE.m}px ${SPACE.s}px ${SPACE.xxl}px`,
        boxShadow:SHADOW.overlay,
      }}>
            {/* Modal header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:`${SPACE.m}px` }}>
              <div style={{ ...T.h3, color:C.textStrong }}>Add component</div>
              <button onClick={()=>setShowModal(false)} style={{ background:"none", border:"none", cursor:"pointer", ...T.small, color:C.muted }}>✕</button>
            </div>

            {/* Step indicators */}
            {[
              { n:"1", title:"Build it", body:"Fill in your task below and copy the prompt. Paste into a new Claude chat. Claude returns a self-contained component function." },
              { n:"2", title:"Copy the component", body:"In the sub-chat, copy the returned component code." },
              { n:"3", title:"Integrate here", body:"Come back to this master chat. Paste the component code and say 'integrate this into App.jsx'. Claude wires up the state, props, and placement." },
              { n:"4", title:"Copy to GitHub", body:"Copy the updated App.jsx from this chat. Open App.jsx in GitHub, select all, paste, commit." },
              { n:"5", title:"Deploy", body:"Vercel auto-deploys within 60 seconds. Done." },
            ].map(({ n, title, body }) => (
              <div key={n} style={{ display:"flex", gap:`${SPACE.s}px`, marginBottom:`${SPACE.s}px` }}>
                <div style={{ width:24, height:24, borderRadius:"50%", background:C.primary, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:"2px" }}>
                  <span style={{ ...T.tiny, fontWeight:"700", color:C.textStrong }}>{n}</span>
                </div>
                <div>
                  <div style={{ ...T.tiny, fontWeight:"700", color:C.textStrong, marginBottom:"2px" }}>{title}</div>
                  <div style={{ ...T.tiny, color:C.textWeak, lineHeight:1.5 }}>{body}</div>
                </div>
              </div>
            ))}

            <div style={{ borderTop:`1px solid ${C.strokeStrong}`, margin:`${SPACE.m}px 0` }}/>

            <SubChatTemplate/>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:`${SPACE.xs}px`, marginBottom:`${SPACE.m}px` }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", ...T.tiny, color:C.muted }}>← Back</button>
      </div>
      <div style={{ ...T.h2, color:C.dark, marginBottom:"4px" }}>Design System</div>
      <div style={{ ...T.small, color:C.muted, marginBottom:`${SPACE.m}px` }}>WFDT · Live token reference</div>

      {/* Add component button */}
      <button onClick={()=>setShowModal(true)} style={{
        width:"100%", padding:`${SPACE.s}px`,
        borderRadius:"32px", border:"none",
        background:C.primary, color:C.textStrong,
        ...T.small, fontWeight:"700",
        cursor:"pointer", marginBottom:`${SPACE.xl}px`,
        display:"flex", alignItems:"center", justifyContent:"center", gap:`${SPACE.xs}px`,
      }}>
        + Add component
      </button>

      {/* Colours */}
      <Section title="Colour tokens">
        {[
          ["primary",      C.primary,      "Lime — brand, selected, CTA"],
          ["red",          C.red,          "Error, destructive"],
          ["textStrong",   C.textStrong,   "Primary text, icons"],
          ["textWeak",     C.textWeak,     "Secondary text"],
          ["strokeStrong", C.strokeStrong, "Borders, dividers"],
          ["strokeWeak",   C.strokeWeak,   "Page background"],
          ["fill",         C.fill,         "Input fields, stepper"],
          ["background",   C.background,   "Cards, chip bg"],
          ["pill",         C.pill,         "Selected pill bg"],
        ].map(([name, hex, desc]) => (
          <div key={name} style={{ display:"flex", alignItems:"center", gap:`${SPACE.s}px`, marginBottom:`${SPACE.xs}px` }}>
            <div style={{ width:40, height:40, borderRadius:"8px", background:hex, border:`1px solid ${C.strokeStrong}`, flexShrink:0 }}/>
            <div>
              <div style={{ ...T.tiny, fontWeight:"700", color:C.dark }}>{name}</div>
              <div style={{ ...T.tiny, color:C.muted }}>{hex} · {desc}</div>
            </div>
          </div>
        ))}
      </Section>

      {/* Spacing */}
      <Section title="Spacing tokens">
        {Object.entries(SPACE).map(([name, val]) => (
          <div key={name} style={{ display:"flex", alignItems:"center", gap:`${SPACE.s}px`, marginBottom:`${SPACE.xs}px` }}>
            <div style={{ width:`${val}px`, height:"8px", background:C.primary, borderRadius:"2px", flexShrink:0, minWidth:"2px" }}/>
            <span style={{ ...T.tiny, color:C.dark }}>{name.toUpperCase()} · {val}px</span>
          </div>
        ))}
      </Section>

      {/* Typography */}
      <Section title="Typography">
        {[
          ["H1", T.h1, "What's for dinner tonight?"],
          ["H2", T.h2, "Here's what you can make"],
          ["H3", T.h3, "Ingredients"],
          ["Small", T.small, "Chicken breast · Broccoli · Rice"],
          ["Tiny", T.tiny, "Swap or remove"],
        ].map(([name, style, sample]) => (
          <div key={name} style={{ marginBottom:`${SPACE.s}px`, paddingBottom:`${SPACE.s}px`, borderBottom:`1px solid ${C.strokeWeak}` }}>
            <div style={{ ...T.tiny, color:C.muted, marginBottom:"4px" }}>{name} · {style.fontSize}/{style.lineHeight}</div>
            <div style={{ ...style, color:C.dark }}>{sample}</div>
          </div>
        ))}
      </Section>

      {/* Components */}
      <Section title="Elevation">
        <div style={{ display:"flex", gap:`${SPACE.m}px`, flexWrap:"wrap" }}>
          {[["Raised", SHADOW.raised], ["Overlay", SHADOW.overlay]].map(([name, shadow]) => (
            <div key={name} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:`${SPACE.xs}px` }}>
              <div style={{ width:80, height:48, background:C.background, borderRadius:"8px", boxShadow:shadow }}/>
              <span style={{ ...T.tiny, color:C.muted }}>{name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Icon set">
        <div style={{ display:"flex", flexWrap:"wrap", gap:`${SPACE.m}px` }}>
          {[
            ["ChickenIcon active",   <ChickenIcon active={true}/>],
            ["ChickenIcon inactive", <ChickenIcon active={false}/>],
            ["VegeIcon active",      <VegeIcon active={true}/>],
            ["VegeIcon inactive",    <VegeIcon active={false}/>],
            ["BeefIcon active",      <BeefIcon active={true}/>],
            ["BeefIcon inactive",    <BeefIcon active={false}/>],
            ["SeafoodIcon active",   <SeafoodIcon active={true}/>],
            ["SeafoodIcon inactive", <SeafoodIcon active={false}/>],
            ["SearchIcon",           <SearchIcon/>],
            ["PlusIcon",             <PlusIcon/>],
            ["MinusIcon",            <MinusIcon/>],
          ].map(([name, el]) => (
            <div key={name} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:`${SPACE.xxs}px` }}>
              <div style={{ width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", background:C.fill, borderRadius:"8px", border:`1px solid ${C.strokeStrong}` }}>{el}</div>
              <span style={{ ...T.tiny, color:C.muted, textAlign:"center", maxWidth:"60px" }}>{name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Category tab — active / inactive">
        <div style={{ display:"flex", gap:`${SPACE.xs}px` }}>
          <CategoryTab label="Chicken" icon={(active) => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill={C.strokeStrong}/>
              <rect x="8" y="10" width="8" height="6" rx="2" fill={active ? C.fill : C.textStrong} opacity="0.6"/>
            </svg>
          )} active={true} onClick={()=>{}}/>
          <CategoryTab label="Vegetarian" icon={(active) => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill={C.strokeStrong}/>
              <rect x="8" y="10" width="8" height="6" rx="2" fill={active ? C.fill : C.textStrong} opacity="0.6"/>
            </svg>
          )} active={false} onClick={()=>{}}/>
          <CategoryTab label="Beef & Lamb" icon={(active) => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill={C.strokeStrong}/>
              <rect x="8" y="10" width="8" height="6" rx="2" fill={active ? C.fill : C.textStrong} opacity="0.6"/>
            </svg>
          )} active={false} onClick={()=>{}}/>
        </div>
      </Section>

      <Section title="Chip — unselected / selected">
        <div style={{ display:"flex", gap:`${SPACE.xs}px`, flexWrap:"wrap" }}>
          <Chip label="Chicken breast" selected={false} onClick={()=>{}}/>
          <Chip label="Chicken breast" selected={true} onClick={()=>{}}/>
        </div>
      </Section>

      <Section title="Stepper">
        <Stepper value={stepVal} onChange={setStepVal}/>
      </Section>

      <Section title="Macro bar — grams / percent">
        <div style={{ display:"flex", flexDirection:"column", gap:`${SPACE.s}px` }}>
          <MacroBar protein={35} carbs={40} fat={25} calories={500} size="lg"/>
          <MacroBar protein={35} carbs={40} fat={25}/>
        </div>
      </Section>

      <Section title="Pill states">
        <div style={{ display:"flex", gap:`${SPACE.xs}px`, flexWrap:"wrap" }}>
          {["Chicken breast","Kumara","Broccoli"].map(item => (
            <div key={item} style={{ padding:"5px 11px", borderRadius:"100px", background:C.pill, color:C.pillText, ...T.tiny, fontWeight:"700", display:"flex", alignItems:"center", gap:"5px" }}>
              {item} <span style={{ opacity:0.5 }}>✕</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Buttons">
        <div style={{ display:"flex", flexDirection:"column", gap:`${SPACE.xs}px` }}>
          <button style={{ width:"100%", padding:"18px", borderRadius:"32px", border:"none", background:C.lime, color:C.dark, ...T.small, fontWeight:"700", cursor:"pointer" }}>✦ Generate meal</button>
          <button style={{ width:"100%", padding:"16px", borderRadius:"32px", border:`1px solid ${C.border}`, background:"transparent", color:C.dark, ...T.small, fontWeight:"700", cursor:"pointer" }}>↻ Regenerate ideas</button>
          <button style={{ width:"100%", padding:"16px", borderRadius:"32px", border:"none", background:C.dark, color:C.background, ...T.small, fontWeight:"700", cursor:"pointer" }}>↻ Regenerate as Italian</button>
        </div>
      </Section>

      <Section title="Accordion">
        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:`${SPACE.s}px`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ ...T.small, fontWeight:"700", color:C.dark }}>Calorie and macro details</span>
          <span style={{ ...T.tiny, color:C.muted }}>▼</span>
        </div>
      </Section>

      <Section title="Food taxonomy">
        <TaxonomyAccordion/>
      </Section>
    </div>
  );
}

// ─── SUB-CHAT TEMPLATE ────────────────────────────────────────────────────────
const GITHUB_BASE = "https://github.com/jamesrrweeks/wfdt/blob/main";

function DSField({ label, url, value, onChange, placeholder, rows = 3 }) {
  return (
    <div style={{ marginBottom:`${SPACE.m}px` }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:`${SPACE.xs}px` }}>
        <span style={{ ...T.tiny, fontWeight:"700", color:C.textWeak, textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</span>
        {url && <a href={url} target="_blank" rel="noreferrer" style={{ ...T.tiny, color:C.textStrong, fontWeight:"700", textDecoration:"underline" }}>Open ↗</a>}
      </div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          width:"100%", padding:`${SPACE.s}px`,
          borderRadius:"12px", border:`1px solid ${C.strokeStrong}`,
          background:C.background, ...T.tiny, color:C.textStrong,
          resize:"vertical", outline:"none", lineHeight:1.6, fontFamily:F,
        }}
      />
    </div>
  );
}

function SubChatTemplate() {
  const [summary, setSummary]     = useState("");
  const [task, setTask]           = useState("");
  const [copied, setCopied]       = useState(false);

  const handleCopy = () => {
    const tokens = `## Design tokens (copy these exactly — no new hardcoded values)

\`\`\`javascript
// COLOURS
const C = {
  primary:      "#CDEA45",  // lime — selected state, CTA, brand
  red:          "#BC4749",  // errors, destructive
  textStrong:   "#3D331A",  // primary text, icons, interactions
  textWeak:     "#7A7059",  // secondary / muted text
  strokeStrong: "#A69A80",  // borders, dividers
  strokeWeak:   "#F0ECE4",  // page background
  fill:         "#FAF8F5",  // input fields, stepper buttons, chip container bg
  background:   "#FFFFFF",  // cards, chip backgrounds
  pill:         "#3D331A",  // selected ingredient pill bg
  pillText:     "#FAF8F5",  // selected ingredient pill text
  // aliases
  get dark()   { return this.textStrong  },
  get lime()   { return this.primary     },
  get muted()  { return this.textWeak    },
  get border() { return this.strokeStrong },
  get bg()     { return this.strokeWeak  },
  get white()  { return this.background  },
};

// SPACING
const SPACE = { nil:0, xxs:4, xs:8, s:16, m:24, l:32, xl:48, xxl:80 };

// TYPOGRAPHY — all Atkinson Hyperlegible
const F = "'Atkinson Hyperlegible', sans-serif";
const T = {
  h1:    { fontSize:"40px", lineHeight:"48px", fontFamily:F, fontWeight:"700" },
  h2:    { fontSize:"32px", lineHeight:"40px", fontFamily:F, fontWeight:"700" },
  h3:    { fontSize:"20px", lineHeight:"28px", fontFamily:F, fontWeight:"700" },
  small: { fontSize:"16px", lineHeight:"24px", fontFamily:F, fontWeight:"400" },
  tiny:  { fontSize:"14px", lineHeight:"20px", fontFamily:F, fontWeight:"400" },
};

// ELEVATION
const SHADOW = {
  raised:  "0px 2px 2px rgba(51,61,26,0.1)",
  overlay: "0px 8px 6px -2px rgba(61,51,26,0.15)",
};
\`\`\`

## Component specs
- Chip: height 36px, radius 32px, padding xs/s, unselected = white bg + strokeStrong border, selected = primary bg + primary border, T.tiny text
- CategoryTab: height 64px, radius 8px, padding xs/s, active = textStrong bg no border, inactive = fill bg + strokeStrong border, SHADOW.raised, icon 24×24 + xxs gap + T.tiny label
- Search field: height 40px, radius 32px, padding xs/s, strokeStrong border, background bg, SearchIcon 16×16 leading
- Chip container: fill bg, strokeStrong border, radius 16px, SHADOW.overlay, overflow hidden — pills section padding m/s, search section padding 0/s/s
- Stepper: 120×40px, left pill button radius 48px 0 0 48px, centre 31px wide border top/bottom only, right button radius 0 48px 48px 0, fill bg buttons`;

    const lines = [
      "I'm building a component for WFDT (What's For Dinner Tonight) — a mobile-first AI meal planning web app for NZ home cooks.",
      "It uses React JSX with inline styles. Font: Atkinson Hyperlegible via Google Fonts.",
      "",
      "## Project context",
      summary || "[Optional: paste SUMMARY.md contents for broader context]",
      "",
      tokens,
      "",
      "## Task",
      task || "[Describe what you're building. Paste Figma CSS exports here.]",
      "",
      "## Output",
      "Return only the component code as a self-contained React function.",
      "Use the design tokens above exactly. No new hardcoded colour or spacing values.",
      "If you need the full App.jsx to integrate the component, ask and I will paste it.",
    ];
    const prompt = lines.join("\n");

    const doFallback = () => {
      const el = document.createElement("textarea");
      el.value = prompt;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(prompt)
        .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); })
        .catch(doFallback);
    } else {
      doFallback();
    }
  };

  return (
    <div>
      <div style={{ ...T.tiny, color:C.textWeak, marginBottom:`${SPACE.m}px`, lineHeight:1.6 }}>
        Design tokens are embedded automatically. Just describe your task and optionally add project context.
      </div>
      <DSField
        label="Project context (optional)"
        url={`${GITHUB_BASE}/docs/SUMMARY.md`}
        value={summary}
        onChange={setSummary}
        placeholder="Open SUMMARY.md ↗ and paste here for broader context — or leave blank for component-only work..."
        rows={3}
      />
      <DSField
        label="Your task"
        url={null}
        value={task}
        onChange={setTask}
        placeholder="Describe what you're building. Paste Figma CSS exports here..."
        rows={5}
      />
      <div style={{ marginBottom:`${SPACE.m}px`, padding:`${SPACE.s}px`, borderRadius:"12px", border:`1px solid ${C.strokeStrong}`, background:C.fill }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ ...T.tiny, color:C.textWeak, fontStyle:"italic" }}>Need to modify existing logic? Also paste App.jsx.</span>
          <a href={`${GITHUB_BASE}/src/App.jsx`} target="_blank" rel="noreferrer" style={{ ...T.tiny, color:C.textStrong, fontWeight:"700", textDecoration:"underline", flexShrink:0, marginLeft:`${SPACE.xs}px` }}>Open ↗</a>
        </div>
      </div>
      <button onClick={handleCopy} style={{
        width:"100%", padding:`${SPACE.s}px`, borderRadius:"32px", border:"none",
        background: copied ? C.strokeStrong : C.primary,
        color: C.textStrong, ...T.small, fontWeight:"700",
        cursor:"pointer", transition:"background 0.2s",
      }}>
        {copied ? "✓ Prompt copied — paste into Claude" : "Copy prompt"}
      </button>
    </div>
  );
}

// ─── TAXONOMY ACCORDION ───────────────────────────────────────────────────────
function TaxonomyAccordion() {
  const [open, setOpen] = useState({});
  const toggle = (key) => setOpen(o => ({ ...o, [key]: !o[key] }));

  const TAXONOMY = [
    {
      section: "Protein",
      categories: [
        { name:"Chicken", items:["Chicken breast","Chicken thighs","Chicken mince","Chicken drumsticks","Chicken wings","Turkey mince","Turkey breast","Duck","Duck breast"] },
        { name:"Vegetarian", items:["Eggs","Tofu","Firm tofu","Silken tofu","Tempeh","Chickpeas","Lentils","Red lentils","Kidney beans","Black beans","Butter beans","Edamame","Halloumi","Paneer","Quorn mince"] },
        { name:"Beef & Lamb", items:["Beef mince","Beef steak","Beef strips","Beef short ribs","Beef brisket","Lamb chops","Lamb mince","Lamb shoulder","Lamb rack","Lamb shank","Sausages","Pork belly","Pork mince","Pork chops","Pork shoulder","Pork ribs","Bacon","Ham","Chorizo","Pancetta","Prosciutto"] },
        { name:"Seafood", items:["Salmon","Salmon fillet","White fish","Snapper","Tarakihi","Blue cod","Prawns","Tuna (canned)","Sardines","Mussels","Squid","Scallops","Crab","Smoked salmon"] },
      ]
    },
    {
      section: "Carbs",
      categories: [
        { name:"Pasta & Noodles", items:["Pasta","Spaghetti","Penne","Fettuccine","Gnocchi","Orzo","Noodles","Udon noodles","Soba noodles","Rice noodles","Glass noodles","Couscous","Polenta"] },
        { name:"Rice & Grains", items:["Rice","Basmati rice","Jasmine rice","Brown rice","Arborio rice","Quinoa","Bulgur wheat","Pearl barley","Freekeh","Farro","Millet"] },
        { name:"Bread & Wraps", items:["Sourdough","White bread","Wholegrain bread","Flatbread","Tortillas","Corn tortillas","Pita","Naan","Bao buns","Burger buns","Crumpets","English muffins"] },
        { name:"Potato & Root", items:["Potatoes","Kumara","Sweet potato","Baby potatoes","Parsnip","Cassava","Taro","Yam"] },
        { name:"No carbs", items:["No carbs"] },
      ]
    },
    {
      section: "Vegetables",
      categories: [
        { name:"All year", items:["Onion","Red onion","Garlic","Celery","Capsicum","Spinach","Baby spinach","Broccoli","Courgette","Mushrooms","Button mushrooms","Silverbeet","Carrot","Tomatoes","Cucumber","Avocado","Corn","Pumpkin"] },
        { name:"Summer", items:["Courgette","Capsicum","Tomatoes","Cherry tomatoes","Corn","Cucumber","Eggplant","Beans","Green beans","Peas","Spinach","Lettuce","Rocket","Zucchini flowers","Basil"] },
        { name:"Autumn", items:["Pumpkin","Butternut squash","Kumara","Carrot","Beetroot","Broccoli","Broccolini","Cauliflower","Cabbage","Silverbeet","Kale","Leek","Mushrooms","Shiitake","Capsicum","Feijoa","Parsnip"] },
        { name:"Winter", items:["Kumara","Pumpkin","Parsnip","Carrot","Beetroot","Cauliflower","Cabbage","Savoy cabbage","Kale","Brussels sprouts","Broccoli","Leek","Silverbeet","Spinach","Onion","Spring onion","Celeriac"] },
        { name:"Spring", items:["Asparagus","Peas","Snap peas","Broad beans","Beans","Spinach","Baby spinach","Lettuce","Radish","Spring onion","Courgette","Broccolini","Fennel","Artichoke"] },
      ]
    },
  ];

  const cell = { padding:`${SPACE.xs}px ${SPACE.s}px`, ...T.tiny, color:C.textStrong, borderBottom:`1px solid ${C.strokeWeak}`, verticalAlign:"top" };
  const hCell = { ...cell, fontWeight:"700", color:C.textWeak, background:C.fill, textTransform:"uppercase", letterSpacing:"0.08em" };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:`${SPACE.xs}px` }}>
      {TAXONOMY.map(({ section, categories }) => {
        const isOpen = open[section];
        return (
          <div key={section} style={{ border:`1px solid ${C.strokeStrong}`, borderRadius:"12px", overflow:"hidden" }}>
            {/* Accordion header */}
            <button onClick={()=>toggle(section)} style={{
              width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:`${SPACE.s}px`, background:C.fill, border:"none", cursor:"pointer",
            }}>
              <span style={{ ...T.small, fontWeight:"700", color:C.textStrong }}>{section}</span>
              <span style={{ ...T.tiny, color:C.muted, transition:"transform 0.2s", display:"inline-block", transform:isOpen?"rotate(180deg)":"rotate(0deg)" }}>▼</span>
            </button>
            {/* Table */}
            {isOpen && (
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", background:C.background }}>
                  <thead>
                    <tr>
                      <th style={{ ...hCell, width:"30%" }}>Category</th>
                      <th style={{ ...hCell }}>Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(({ name, items }) => (
                      <tr key={name}>
                        <td style={{ ...cell, fontWeight:"700", whiteSpace:"nowrap" }}>{name}</td>
                        <td style={{ ...cell }}>{items.join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]           = useState("input");
  const [prefs, setPrefs]             = useState(null);
  const [meals, setMeals]             = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isLoading, setIsLoading]     = useState(false);
  const [apiError, setApiError]       = useState(null);

  // Inject font at root level once
  useState(() => {
    if (!document.getElementById("wfdt-font")) {
      const link = document.createElement("link");
      link.id = "wfdt-font";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap";
      document.head.appendChild(link);
    }
  });

  const handleGenerate = async (p) => {
    setPrefs(p); setApiError(null); setIsLoading(true);
    try {
      const r = await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,messages:[{role:"user",content:buildPrompt(p)}]})});
      const d=await r.json(); const t=d.content[0].text; const c=t.replace(/```json|```/g,"").trim();
      setMeals(JSON.parse(c).map((m,i)=>({...m,id:i+1})));
    } catch { setApiError("Couldn't connect — showing example meals."); setMeals(MOCK_MEALS); }
    finally { setIsLoading(false); setScreen("results"); }
  };

  return (
    <div style={{ background:C.bg, minHeight:"100vh", display:"flex", justifyContent:"center", fontFamily:F }}>
      <div style={{ width:"390px", minHeight:"100vh", background:C.bg, fontFamily:F }}>
        {screen==="input" && <InputScreen onGenerate={handleGenerate} isLoading={isLoading} onShowDS={()=>setScreen("ds")}/>}
        {screen==="ds" && <DesignSystemScreen onBack={()=>setScreen("input")}/>}
        {screen==="results" && (
          <>
            {apiError && <div style={{ background:"#FFF0ED", borderBottom:"1px solid #F5C2B8", padding:"10px 20px", fontSize:"12px", color:`${C.red}`, fontFamily:F }}>⚠ {apiError}</div>}
            <ResultsScreen prefs={prefs} meals={meals} isLoading={isLoading}
              onSelect={m=>{setSelectedMeal(m);setScreen("recipe");}}
              onBack={()=>setScreen("input")}
              onRegenerate={cuisine=>handleGenerate({...prefs,cuisine})}/>
          </>
        )}
        {screen==="recipe" && <RecipeScreen meal={selectedMeal} onBack={()=>setScreen("results")}/>}
      </div>
    </div>
  );
}