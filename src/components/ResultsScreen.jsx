import { useState } from "react";
import { C, SPACE, T, F, FD, SHADOW } from "../tokens.js";
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
      <button
        onClick={onRemove}
        style={{
          background:"none", border:"none", cursor:"pointer",
          padding:"0", display:"flex", alignItems:"center", justifyContent:"center",
          width:"20px", height:"20px", color:C.textStrong, fontSize:"16px", lineHeight:"1",
        }}
      >✕</button>
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

export default function ResultsScreen({ prefs, meals, onSelect, onBack, onRegenerate, onRemix, isLoading }) {
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
    <div style={{ paddingBottom:"120px" }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* Header */}
      <div style={{ padding:`${SPACE.xxl}px ${SPACE.s}px ${SPACE.m}px` }}>
        <button
          onClick={onBack}
          style={{
            background:"none", border:"none", cursor:"pointer",
            padding:"0 0 12px", color:C.muted,
            fontFamily:F, fontSize:"14px",
            display:"flex", alignItems:"center", gap:"4px",
            textDecoration:"underline",
          }}
        >
          ← Back
        </button>
        <h1 style={{ ...T.h1, color:C.textStrong, margin:0 }}>Results</h1>
      </div>

      {/* Cards */}
      <div style={{ padding:`0 ${SPACE.s}px`, display:"flex", flexDirection:"column", gap:`${SPACE.m}px` }}>
        {meals.map((meal, i) => (
          <MealCard
            key={meal.id}
            meal={meal}
            onSelect={onSelect}
            onRemix={onRemix}
          />
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding:`${SPACE.m}px ${SPACE.s}px 0`, display:"flex", flexDirection:"column", gap:`${SPACE.m}px` }}>

        {/* Pref pills */}
        {activePills.length > 0 && (
          <div style={{ display:"flex", flexDirection:"row", flexWrap:"wrap", gap:"8px" }}>
            {activePills.map(pill => (
              <PrefPill key={pill.id} label={pill.label} onRemove={() => removePill(pill)} />
            ))}
          </div>
        )}

        {/* Cuisine chips */}
        <div>
          <div style={{ fontSize:"10px", fontWeight:"700", letterSpacing:"0.1em", textTransform:"uppercase", color:C.muted, fontFamily:F, marginBottom:"12px" }}>
            🍽 Try a cuisine
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
            {CUISINES.map(c => (
              <Chip key={c} label={c} selected={cuisine===c} onClick={() => setCuisine(c)} />
            ))}
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          style={{
            width:"100%", height:"65px",
            borderRadius:"32px", border:"none",
            background:isLoading ? C.strokeStrong : C.primary,
            color:C.textStrong,
            fontFamily:F, fontSize:"20px", fontWeight:"700",
            cursor:isLoading ? "not-allowed" : "pointer",
            display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
            transition:"opacity 0.1s",
          }}
        >
          {isLoading
            ? <><span style={{ animation:"spin 1s linear infinite", display:"inline-block" }}>✦</span> Finding ideas...</>
            : `↻ ${cuisine !== "Any" ? `Regenerate as ${cuisine}` : "Regenerate ideas"}`
          }
        </button>

      </div>
    </div>
  );
}
