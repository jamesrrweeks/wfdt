import { useState } from "react";
import { C, SPACE, T, F, SHADOW } from "../tokens.js";
import { CURRENT_SEASON, PROTEIN_CATEGORIES, CARB_CATEGORIES, DEFAULT_MACROS } from "../data.jsx";
import CategoryChipSelector from "./CategoryChipSelector.jsx";
import VegSelector from "./VegSelector.jsx";
import MacroSelector, { CalorieSlider } from "./MacroSelector.jsx";
import Stepper from "./Stepper.jsx";
import AddContext from "./AddContext.jsx";

export default function InputScreen({ onGenerate, isLoading, onShowDS }) {
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
        <div style={{ padding:`0 ${SPACE.s}px`, marginBottom:`${SPACE.m}px` }}>
          <div style={{ ...T.small, fontWeight:"700", color:C.textStrong, borderTop:`1px solid ${C.strokeStrong}`, paddingTop:`${SPACE.s}px`, marginBottom:`${SPACE.s}px` }}>How many servings?</div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <Stepper value={people} onChange={setPeople}/>
            <span style={{ ...T.tiny, color:C.muted, fontFamily:F }}>
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
        <div style={{ padding:`0 ${SPACE.s}px` }}>
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
            onAdd={(note) => { const v=note.trim(); if(v) setFreeNotes(prev=>[...prev,v]); }}
            placeholder="e.g. nothing spicy, use up leftovers, allergic to nuts…"
          />
        </div>
      </div>

      {/* Sticky footer */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"390px", padding:"12px 20px 32px", background:`linear-gradient(transparent, ${C.bg} 30%)`, zIndex:10 }}>
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
                style={{ padding:"5px 11px", borderRadius:"100px", border:`1px solid ${C.border}`, background:"transparent", color:C.dark, fontSize:"12px", fontFamily:F, fontWeight:"600", cursor:"pointer", display:"flex", alignItems:"center", gap:"5px", fontStyle:"italic" }}>
                {note.length>24?note.slice(0,24)+"…":note} <span style={{ opacity:0.5, fontSize:"10px" }}>✕</span>
              </button>
            ))}
          </div>
        )}
        <button
          onClick={()=>onGenerate({season,proteins,carbs,veg,calories,macros,people,freeText:freeNotes.join(". ")})}
          disabled={isLoading}
          style={{ width:"100%", padding:"18px", borderRadius:"32px", border:"none", background:isLoading?C.strokeStrong:C.lime, color:C.dark, fontSize:"17px", fontFamily:F, fontWeight:"700", cursor:isLoading?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"10px" }}>
          {isLoading ? <><span style={{ width:18, height:18, border:`3px solid ${C.dark}`, borderTopColor:"transparent", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}/> Finding ideas…</> : "✦ Generate meal"}
        </button>
      </div>
    </div>
  );
}
