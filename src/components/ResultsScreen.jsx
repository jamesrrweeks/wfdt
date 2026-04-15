import { useState } from "react";
import { C, SPACE, T, F } from "../tokens.js";
import { SEASON_EMOJI } from "../data.jsx";
import Chip from "./Chip.jsx";
import MealCard from "./MealCard.jsx";

export default function ResultsScreen({ prefs, meals, onSelect, onBack, onRegenerate, isLoading }) {
  const [cuisine, setCuisine] = useState("Any");

  const parts = [
    SEASON_EMOJI[prefs.season]+" "+prefs.season,
    !prefs.proteins.includes("Any") && prefs.proteins.join(", "),
    `${prefs.calories} kcal`,
    `${prefs.people} ${prefs.people===1?"serving":"servings"}`,
  ].filter(Boolean);

  return (
    <div style={{ paddingBottom:"120px" }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* Header */}
      <div style={{ padding:`${SPACE.xxl}px ${SPACE.s}px ${SPACE.m}px` }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", padding:"0 0 12px", color:C.muted, fontSize:"14px", fontFamily:F, display:"flex", alignItems:"center", gap:"4px" }}>← Back</button>
        <h2 style={{ ...T.h2, color:C.textStrong, margin:"0 0 6px" }}>Here's what<br/>you can make</h2>
        <p style={{ color:C.muted, fontSize:"13px", fontFamily:F, margin:0 }}>{parts.join(" · ")}</p>
      </div>

      {/* Meal cards */}
      <div style={{ padding:`0 ${SPACE.s}px`, display:"flex", flexDirection:"column", gap:`${SPACE.s}px` }}>
        {meals.map((meal, i) => (
          <MealCard
            key={meal.id}
            meal={meal}
            prefs={prefs}
            index={i}
            onRemix={() => {}}
            onView={() => onSelect(meal)}
          />
        ))}
      </div>

      {/* Cuisine + regenerate */}
      <div style={{ padding:`${SPACE.m}px ${SPACE.s}px 0` }}>
        <div style={{ borderTop:`1px solid ${C.strokeStrong}`, paddingTop:`${SPACE.m}px` }}>
          <div style={{ fontSize:"10px", fontWeight:"700", letterSpacing:"0.1em", textTransform:"uppercase", color:C.muted, fontFamily:F, marginBottom:"12px" }}>🍽 Try a cuisine</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:`${SPACE.s}px` }}>
            {["Any","Italian","Asian","Mexican","Middle Eastern","Indian","Japanese","French","American","Mediterranean"].map(c=>(
              <Chip key={c} label={c} selected={cuisine===c} onClick={()=>setCuisine(c)}/>
            ))}
          </div>
          <button
            onClick={()=>onRegenerate(cuisine)}
            disabled={isLoading}
            style={{
              width:"100%", padding:"16px", borderRadius:"100px",
              border:`1.5px solid ${cuisine!=="Any"?"transparent":C.strokeStrong}`,
              background:isLoading?C.muted:cuisine!=="Any"?C.textStrong:"transparent",
              color:isLoading?C.background:cuisine!=="Any"?C.background:C.textStrong,
              fontSize:"15px", fontWeight:"700", fontFamily:F,
              cursor:isLoading?"not-allowed":"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
            }}
          >
            {isLoading
              ? <><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>✦</span> Finding ideas...</>
              : `↻ ${cuisine!=="Any"?`Regenerate as ${cuisine}`:"Regenerate ideas"}`
            }
          </button>
        </div>
      </div>

    </div>
  );
}
