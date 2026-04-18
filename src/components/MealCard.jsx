import { C, SPACE, T, F, SHADOW } from "../tokens.js";
import {
  ChickenIcon, VegeIcon, BeefIcon, SeafoodIcon,
  RiceIcon, NoodlesIcon, BreadIcon, RootVegeIcon,
  SummerIcon, AutumnIcon, WinterIcon, SpringIcon,
} from "../icons.jsx";

const ICON_MAP = {
  "Chicken":         ChickenIcon,
  "Beef & Lamb":     BeefIcon,
  "Seafood":         SeafoodIcon,
  "Vegetarian":      VegeIcon,
  "Rice & Grains":   RiceIcon,
  "Pasta & Noodles": NoodlesIcon,
  "Bread & Wraps":   BreadIcon,
  "Potato & Root":   RootVegeIcon,
};

const SEASON_ICON_MAP = {
  "Summer": SummerIcon,
  "Autumn": AutumnIcon,
  "Winter": WinterIcon,
  "Spring": SpringIcon,
};

const FALLBACK_ICONS = [VegeIcon, RiceIcon, AutumnIcon];

function getMealIcon(meal, prefs, index) {
  if (meal.icon && ICON_MAP[meal.icon]) return ICON_MAP[meal.icon];
  if (prefs?.season && SEASON_ICON_MAP[prefs.season]) return SEASON_ICON_MAP[prefs.season];
  return FALLBACK_ICONS[index % FALLBACK_ICONS.length];
}

const Tag = ({ label }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "3px 16px",
    background: C.primaryMuted,
    borderRadius: "8px",
    ...T.tiny,
    color: C.textStrong,
    whiteSpace: "nowrap",
  }}>{label}</div>
);

export default function MealCard({ meal, prefs, index = 0, onRemix, onView }) {
  const Icon = getMealIcon(meal, prefs, index);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      padding: `${SPACE.s}px`,
      gap: `${SPACE.s}px`,
      width: "100%",
      background: C.background,
      boxShadow: SHADOW.overlay,
      borderRadius: "16px",
      boxSizing: "border-box",
    }}>

      {/* Info block */}
      <div style={{ display:"flex", flexDirection:"column", gap:`${SPACE.xs}px` }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{
            width: "40px", height: "40px",
            background: C.fill,
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Icon active={false} />
          </div>
          <div style={{ ...T.h3, color: C.textStrong, flex: 1 }}>
            {meal.name}
          </div>
        </div>
        <div style={{
          ...T.small,
          color: C.textStrong,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {meal.description}
        </div>
      </div>

      {/* Tags — from AI: cuisine, time, calories */}
      <div style={{ display:"flex", flexDirection:"row", gap:"6px", flexWrap:"wrap" }}>
        {meal.cuisine  && <Tag label={meal.cuisine} />}
        {meal.time     && <Tag label={meal.time} />}
        {meal.calories && <Tag label={`${meal.calories} kcal`} />}
      </div>

      {/* Actions */}
<div style={{ display:"flex", gap:`${SPACE.xs}px`, width:"100%" }}>
  {/* <button onClick={onRemix} style={{
    flex: 1, height: "36px",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "8px 16px",
    background: C.background,
    border: `1px solid ${C.strokeStrong}`,
    borderRadius: "32px",
    ...T.tiny, color: C.textStrong,
    cursor: "pointer",
    fontFamily: F,
  }}>Remix</button> */}
  <button onClick={onView} style={{
    flex: 1, height: "36px",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "8px 16px",
    background: C.textStrong,
    border: `1px solid ${C.textStrong}`,
    borderRadius: "32px",
    ...T.tiny, color: C.background,
    cursor: "pointer",
    fontFamily: F,
  }}>View recipe</button>
</div>

    </div>
  );
}
