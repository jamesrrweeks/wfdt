import { useState } from "react";
import { C, SPACE, T, F } from "../tokens.js";
import { SEASON_EMOJI } from "../data.jsx";
import Chip from "./Chip.jsx";
import MacroBar from "./MacroBar.jsx";

function MealCard({ meal, featured, onSelect }) {
  return (
    <div style={{ background:C.background, borderRadius:"20px", overflow:"hidden", border:`1.5px solid ${featured?C.primary:C.strokeStrong}`, boxShadow:featured?`0 0 0 1px ${C.primary}`:C.shadow }}>
      <button onClick={()=>onSelect(meal)} style={{ width:"100%", background:"none", border:"none", cursor:"pointer", textAlign:"left", padding:"20px" }}
        onMouseDown={e=>e.currentTarget.style.opacity="0.8"}
        onMouseUp={e=>e.currentTarget.style.opacity="1"}
      >
        {featured && (
          <div style={{ display:"inline-flex", alignItems:"center", background:C.primary, borderRadius:"100px", padding:"3px 10px", marginBottom:"10px" }}>
            <span style={{ fontSize:"11px", fontWeight:"700", color:C.textStrong, fontFamily:F }}>✦ Top pick</span>
          </div>
        )}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:"28px", marginBottom:"8px" }}>{meal.emoji}</div>
            <div style={{ ...T.h3, color:C.textStrong, marginBottom:"4px" }}>{meal.name}</div>
            {meal.description && <div style={{ fontSize:"13px", color:C.muted, fontFamily:F, lineHeight:1.45, marginBottom:"8px" }}>{meal.description}</div>}
            <div style={{ fontSize:"12px", color:C.muted, fontFamily:F, display:"flex", gap:"10px", marginBottom:meal.macros?"10px":"0" }}>
              <span>⏱ {meal.time}</span><span>· {meal.difficulty}</span><span>· 🔥 {meal.calories} kcal</span>
            </div>
            {meal.macros && <MacroBar protein={meal.macros.protein} carbs={meal.macros.carbs} fat={meal.macros.fat} calories={meal.calories}/>}
          </div>
          <div style={{ width:"34px", height:"34px", borderRadius:"50%", background:featured?C.primary:C.strokeWeak, border:`1.5px solid ${C.strokeStrong}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", flexShrink:0, marginLeft:"12px", color:C.textStrong }}>→</div>
        </div>
        <div style={{ marginTop:"14px", padding:"10px 0 0", borderTop:`1px solid ${C.strokeStrong}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:"13px", fontWeight:"700", color:C.textStrong, fontFamily:F }}>View recipe →</span>
        </div>
      </button>
    </div>
  );
}

export default function ResultsScreen({ prefs, meals, onSelect, onBack, onRegenerate, isLoading }) {
  const [cuisine, setCuisine] = useState("Any");
  const parts = [
    SEASON_EMOJI[prefs.season]+" "+prefs.season,
    !prefs.proteins.includes("Any") && prefs.proteins.join(", "),
    `${prefs.calories} kcal`,
    `${prefs.people} ${prefs.people===1?"serving":"servings"}`,
  ].filter(Boolean);

  return (
    <div style={{ paddingBottom:"40px" }}>
      <div style={{ padding:`${SPACE.xxl}px ${SPACE.s}px ${SPACE.m}px` }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", padding:"0 0 12px", color:C.muted, fontSize:"14px", fontFamily:F, display:"flex", alignItems:"center", gap:"4px" }}>← Back</button>
        <h2 style={{ ...T.h2, color:C.textStrong, margin:"0 0 6px" }}>Here's what<br/>you can make</h2>
        <p style={{ color:C.muted, fontSize:"13px", fontFamily:F, margin:0 }}>{parts.join(" · ")}</p>
      </div>

      <div style={{ padding:`0 ${SPACE.s}px`, display:"flex", flexDirection:"column", gap:`${SPACE.xs}px` }}>
        {meals.map((meal,i) => <MealCard key={meal.id} meal={meal} featured={i===0} onSelect={onSelect}/>)}
      </div>

      <div style={{ padding:"24px 20px 0" }}>
        <div style={{ borderTop:`1px solid ${C.strokeStrong}`, paddingTop:"20px" }}>
          <div style={{ fontSize:"10px", fontWeight:"700", letterSpacing:"0.1em", textTransform:"uppercase", color:C.muted, fontFamily:F, marginBottom:"12px" }}>🍽 Try a cuisine</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:`${SPACE.s}px` }}>
            {["Any","Italian","Asian","Mexican","Middle Eastern","Indian","Japanese","French","American","Mediterranean"].map(c=>(
              <Chip key={c} label={c} selected={cuisine===c} onClick={()=>setCuisine(c)}/>
            ))}
          </div>
          <button onClick={()=>onRegenerate(cuisine)} disabled={isLoading}
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
              ? <><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>✦</span>Finding ideas...</>
              : `↻ ${cuisine!=="Any"?`Regenerate as ${cuisine}`:"Regenerate ideas"}`
            }
          </button>
        </div>
      </div>
    </div>
  );
}
