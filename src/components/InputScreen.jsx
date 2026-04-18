import { useState } from "react";
import { C, SPACE, T, F } from "../tokens.js";
import { CURRENT_SEASON, PROTEIN_CATEGORIES, CARB_CATEGORIES } from "../data.jsx";
import CategoryChipSelector from "./CategoryChipSelector.jsx";
import VegSelector from "./VegSelector.jsx";
import Stepper from "./Stepper.jsx";
import AddContext from "./AddContext.jsx";

export default function InputScreen({ onGenerate, isLoading }) {
  const [season, setSeason]       = useState(CURRENT_SEASON);
  const [proteins, setProteins]   = useState(["Any"]);
  const [carbs, setCarbs]         = useState(["Any"]);
  const [veg, setVeg]             = useState(["Any"]);
  const [people, setPeople]       = useState(2);
  const [freeNotes, setFreeNotes] = useState([]);

  const handleSeasonChange = (s) => { setSeason(s); setVeg(["Any"]); };
  const removeFreeNote = (i) => setFreeNotes(prev => prev.filter((_,idx) => idx !== i));

  const selectedPills = [
    ...proteins.filter(s => s !== "Any").map(item => ({ key: `p-${item}`, label: item, onRemove: () => { const next = proteins.filter(s => s !== item); setProteins(next.length === 0 ? ["Any"] : next); }})),
    ...carbs.filter(s => s !== "Any").map(item => ({ key: `c-${item}`, label: item, onRemove: () => { const next = carbs.filter(s => s !== item); setCarbs(next.length === 0 ? ["Any"] : next); }})),
    ...veg.filter(s => s !== "Any").map(item => ({ key: `v-${item}`, label: item, onRemove: () => { const next = veg.filter(s => s !== item); setVeg(next.length === 0 ? ["Any"] : next); }})),
  ];

  return (
    <>
      {/* Serves */}
      <div style={{ display:"flex", flexDirection:"column", gap:`${SPACE.s}px` }}>
        <div style={{ ...T.h3, color:C.textStrong }}>How many servings?</div>
        <Stepper value={people} min={1} max={8} onChange={setPeople}/>
      </div>

      {/* Protein */}
      <div style={{ display:"flex", flexDirection:"column", gap:`${SPACE.s}px` }}>
        <div style={{ ...T.h3, color:C.textStrong }}>Protein</div>
        <CategoryChipSelector categories={PROTEIN_CATEGORIES} selected={proteins} onChange={setProteins} />
      </div>

      {/* Veg */}
      <div style={{ display:"flex", flexDirection:"column", gap:`${SPACE.s}px` }}>
        <div style={{ ...T.h3, color:C.textStrong }}>Vegetables</div>
        <VegSelector season={season} selected={veg} onChange={setVeg} onSeasonChange={handleSeasonChange}/>
      </div>

      {/* Carbs */}
      <div style={{ display:"flex", flexDirection:"column", gap:`${SPACE.s}px` }}>
        <div style={{ ...T.h3, color:C.textStrong }}>Carbs</div>
        <CategoryChipSelector categories={CARB_CATEGORIES} selected={carbs} onChange={setCarbs} />
      </div>

      {/* Anything else */}
      <div style={{ display:"flex", flexDirection:"column", gap:`${SPACE.s}px`, paddingBottom:`${SPACE.xxl + SPACE.xxl + SPACE.xxl + SPACE.xxl}px` }}>
  <div style={{ ...T.h3, color:C.textStrong }}>Anything else?</div>
        <AddContext
          onAdd={(note) => { const v=note.trim(); if(v) setFreeNotes(prev=>[...prev,v]); }}
          placeholder="e.g. nothing spicy, use up leftovers, allergic to nuts…"
        />
        {freeNotes.length > 0 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:`${SPACE.xs}px` }}>
            {freeNotes.map((note, i) => (
              <button key={i} onClick={() => removeFreeNote(i)}
                style={{ padding:"5px 11px", borderRadius:"100px", border:"none", background:C.pill, color:C.pillText, fontSize:"12px", fontFamily:F, fontWeight:"600", cursor:"pointer", display:"flex", alignItems:"center", gap:"5px" }}>
                {note} <span style={{ opacity:0.5, fontSize:"10px" }}>✕</span>
              </button>
            ))}
          </div>
        )}
      </div>

{/* Generate — sticky footer */}
<div style={{
  position:      "fixed",
  bottom:        `${SPACE.xxl + SPACE.s}px`,
  left:          "50%",
  transform:     "translateX(-50%)",
  width:         "390px",
  padding:       `${SPACE.s}px`,
  display:       "flex",
  flexDirection: "column",
  gap:           `${SPACE.xs}px`,
  zIndex:        50,
}}>        {selectedPills.length > 0 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:`${SPACE.xs}px` }}>
            {selectedPills.map(pill => (
              <button key={pill.key} onClick={pill.onRemove}
                style={{ padding:"5px 11px", borderRadius:"100px", border:"none", background:C.pill, color:C.pillText, fontSize:"12px", fontFamily:F, fontWeight:"600", cursor:"pointer", display:"flex", alignItems:"center", gap:"5px" }}>
                {pill.label} <span style={{ opacity:0.5, fontSize:"10px" }}>✕</span>
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => onGenerate({ season, proteins, carbs, veg, people, freeText: freeNotes.join(". ") })}
          disabled={isLoading}
          style={{
            width:"100%", height:"65px",
            borderRadius:"32px", border:"none",
            background: isLoading ? C.strokeStrong : C.primary,
            color:C.textStrong, fontFamily:F, fontSize:"20px", fontWeight:"700",
            cursor: isLoading ? "not-allowed" : "pointer",
            display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
          }}
        >
          {isLoading
            ? <><span style={{ animation:"spin 1s linear infinite", display:"inline-block" }}>✦</span> Finding ideas...</>
            : "Generate meal"
          }
        </button>
      </div>
    </>
  );
}
