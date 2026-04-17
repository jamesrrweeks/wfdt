import { useState } from "react";
import { C, SPACE, T, F } from "../tokens.js";
import { SEASON_EMOJI } from "../data.jsx";
import Chip from "./Chip.jsx";
import MealCard from "./MealCard.jsx";

const CUISINES = ["Any","Italian","Asian","Mexican","Middle Eastern","Indian","Japanese","French","American","Mediterranean"];

function PrefPill({ label, onRemove }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:"4px",
      background:C.primaryMuted, borderRadius:"8px",
      padding:"3px 8px 3px 16px",
      fontSize:"14px", lineHeight:"20px", color:C.textStrong, fontFamily:F,
    }}>
      <span>{label}</span>
      <button onClick={onRemove} style={{ background:"none", border:"none", cursor:"pointer", padding:"0", display:"flex", alignItems:"center", justifyContent:"center", width:"20px", height:"20px", color:C.textStrong, fontSize:"16px", lineHeight:"1" }}>✕</button>
    </div>
  );
}

function buildPills(prefs) {
  const pills = [];
  if (prefs.season) pills.push({ id:"season", label: SEASON_EMOJI[prefs.season] + " " + prefs.season });
  if (prefs.proteins && !prefs.proteins.includes("Any")) {
    prefs.proteins.forEach(p => pills.push({ id:`protein-${p}`, label:p, field:"proteins", value:p }));
  }
  if (prefs.carbs && !prefs.carbs.includes("Any")) {
    prefs.carbs.forEach(c => pills.push({ id:`carb-${c}`, label:c, field:"carbs", value:c }));
  }
  if (prefs.veg && !prefs.veg.includes("Any")) {
    prefs.veg.forEach(v => pills.push({ id:`veg-${v}`, label:v, field:"veg", value:v }));
  }
  if (prefs.people && prefs.people > 1) {
    pills.push({ id:"people", label:`${prefs.people} people`, field:"people" });
  }
  return pills;
}

export default function ResultsScreen({ prefs, meals, onSelect, onRemix, onBack, onRegenerate, isLoading }) {
  const [cuisine, setCuisine] = useState("Any");
  const [activePills, setActivePills] = useState(() => buildPills(prefs));

  const removePill = (pill) => {
    setActivePills(prev => prev.filter(p => p.id !== pill.id));
  };

  const handleGenerate = () => {
    const removedIds = buildPills(prefs)
      .filter(p => !activePills.find(ap => ap.id === p.id))
      .map(p => p.id);

    const updatedPrefs = { ...prefs };
    removedIds.forEach(id => {
      if (id === "season")  updatedPrefs.season = null;
      if (id === "people")  updatedPrefs.people = 1;
      if (id.startsWith("protein-")) {
        const val = id.replace("protein-","");
        updatedPrefs.proteins = updatedPrefs.proteins.filter(p => p !== val);
        if (updatedPrefs.proteins.length === 0) updatedPrefs.proteins = ["Any"];
      }
      if (id.startsWith("carb-")) {
        const val = id.replace("carb-","");
        updatedPrefs.carbs = updatedPrefs.carbs.filter(c => c !== val);
        if (updatedPrefs.carbs.length === 0) updatedPrefs.carbs = ["Any"];
      }
      if (id.startsWith("veg-")) {
        const val = id.replace("veg-","");
        updatedPrefs.veg = updatedPrefs.veg.filter(v => v !== val);
        if (updatedPrefs.veg.length === 0) updatedPrefs.veg = ["Any"];
      }
    });
    onRegenerate({ ...updatedPrefs, cuisine });
  };

  return (
    <>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* Pref pills */}
      {activePills.length > 0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
          {activePills.map(pill => (
            <PrefPill key={pill.id} label={pill.label} onRemove={() => removePill(pill)} />
          ))}
        </div>
      )}

      {/* Cuisine chips */}
      <div style={{ display:"flex", gap:"8px", overflowX:"auto", scrollbarWidth:"none" }}>
        {CUISINES.map(c => (
          <Chip key={c} label={c} selected={cuisine === c} onClick={() => setCuisine(c)} />
        ))}
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        style={{ width:"100%", background:C.primary, border:"none", borderRadius:"12px", padding:"14px", fontSize:"18px", fontWeight:"700", fontFamily:F, color:C.textStrong, cursor:isLoading ? "not-allowed" : "pointer", opacity:isLoading ? 0.7 : 1 }}
      >
        {isLoading ? "Generating…" : "Generate"}
      </button>

      {/* Meal cards */}
      {meals && meals.map(meal => (
        <MealCard
          key={meal.id}
          meal={meal}
          prefs={prefs}
          onView={() => onSelect(meal)}
          onRemix={() => onRemix(meal)}
        />
      ))}
    </>
  );
}
