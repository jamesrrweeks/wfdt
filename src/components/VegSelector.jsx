import { useState } from "react";
import { C, SPACE, T, F, SHADOW } from "../tokens.js";
import { SEASONS, SEASONAL_VEG, SEASON_CATEGORIES } from "../data.jsx";
import CategoryTab from "./CategoryTab.jsx";
import TypeAheadInput from "./TypeAheadInput.jsx";

export default function VegSelector({ season, onSeasonChange, selected, onChange }) {
  const [tab, setTab] = useState("All year");
  const sel = selected.filter(s=>s!=="Any");
  const handleTab = (t) => { setTab(t); if(t!=="All year") onSeasonChange(t); };
  const tabs = ["All year", ...SEASONS];
  const veg = SEASONAL_VEG[tab] || [];

  const toggle = (v) => {
    const next = sel.includes(v) ? sel.filter(s=>s!==v) : [...sel, v];
    onChange(next.length===0 ? ["Any"] : next);
  };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:`${SPACE.xs}px` }}>
        <div style={{ ...T.small, fontWeight:"700", color:C.textStrong }}>Vegetables</div>
        {sel.length>0 && (
          <button onClick={()=>onChange(["Any"])} style={{ background:"none", border:"none", cursor:"pointer", ...T.tiny, color:C.muted, fontFamily:F, textDecoration:"underline" }}>Clear</button>
        )}
      </div>
      <div style={{ display:"flex", gap:`${SPACE.xs}px`, overflowX:"auto", paddingBottom:`${SPACE.xs}px` }}>
        {tabs.map(t => (
          <CategoryTab
            key={t}
            label={t}
            icon={SEASON_CATEGORIES[t].icon}
            active={tab===t}
            onClick={()=>handleTab(t)}
          />
        ))}
      </div>
      <div style={{
        display:"flex", flexDirection:"column",
        background:C.fill, border:`1px solid ${C.strokeStrong}`,
        borderRadius:"16px", boxShadow:SHADOW.overlay, overflow:"hidden",
      }}>
        <div style={{ display:"flex", flexWrap:"wrap", padding:`${SPACE.m}px ${SPACE.s}px`, gap:`${SPACE.xs}px` }}>
          {veg.map(v => {
            const isS = sel.includes(v);
            return (
              <button key={v} onClick={()=>toggle(v)} style={{
                display:"flex", justifyContent:"center", alignItems:"center",
                padding:`${SPACE.xs}px ${SPACE.s}px`, height:"36px",
                borderRadius:"32px", cursor:"pointer",
                border:`1px solid ${isS ? C.primary : C.strokeStrong}`,
                background: isS ? C.primary : C.background,
                transition:"all 0.12s",
              }}>
                <span style={{ ...T.tiny, color:C.textStrong, whiteSpace:"nowrap" }}>{v}</span>
              </button>
            );
          })}
        </div>
        <div style={{ padding:`0px ${SPACE.s}px ${SPACE.s}px` }}>
          <TypeAheadInput
            placeholder="Search vegetables..."
            selectedItems={sel}
            onAdd={v=>{ const w=sel.filter(s=>s!=="Any"); onChange([...w,v]); }}
          />
        </div>
      </div>
    </div>
  );
}
