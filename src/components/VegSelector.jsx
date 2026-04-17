import { useState } from "react";
import { C, SPACE, T, F, SHADOW } from "../tokens.js";
import { SEASONS, SEASONAL_VEG, SEASON_CATEGORIES } from "../data.jsx";
import CategoryTab from "./CategoryTab.jsx";
import TypeAheadInput from "./TypeAheadInput.jsx";

export default function VegSelector({ season, onSeasonChange, selected, onChange }) {
  const [tab, setTab] = useState("All year");
  const sel = selected.filter(s => s !== "Any");

  const handleTab = (t) => { setTab(t); if (t !== "All year") onSeasonChange(t); };
  const tabs = ["All year", ...SEASONS];
  const veg = SEASONAL_VEG[tab] || [];

  const toggle = (v) => {
    const next = sel.includes(v) ? sel.filter(s => s !== v) : [...sel, v];
    onChange(next.length === 0 ? ["Any"] : next);
  };

  return (
    <div>
      <div style={{ display:"flex", gap:`${SPACE.xs}px`, overflowX:"auto", paddingBottom:`${SPACE.xs}px` }}>
        {tabs.map(t => (
          <CategoryTab
            key={t}
            label={t}
            icon={SEASON_CATEGORIES[t].icon}
            active={tab === t}
            onClick={() => handleTab(t)}
          />
        ))}
      </div>
      <div style={{
        display:"flex", flexDirection:"column",
        borderRadius:"16px", boxShadow:SHADOW.overlay, overflow:"hidden",
      }}>
        <div style={{
          display:"flex", flexWrap:"wrap",
          background:C.background,
          borderRadius:"16px 16px 0px 0px",
          padding:`${SPACE.m}px ${SPACE.s}px`, gap:`${SPACE.xs}px`,
        }}>
          {veg.map(v => {
            const isS = sel.includes(v);
            return (
              <button key={v} onClick={() => toggle(v)} style={{
                display:"flex", justifyContent:"center", alignItems:"center",
                padding:`3px ${SPACE.s}px`, height:"36px",
                borderRadius:"8px", cursor:"pointer",
                border:"none",
                background: isS ? C.primaryMuted : C.strokeWeak,
                transition:"all 0.12s",
              }}>
                <span style={{ ...T.tiny, color:C.textStrong, whiteSpace:"nowrap" }}>{v}</span>
              </button>
            );
          })}
        </div>
        <div style={{
          background:C.background,
          borderRadius:"0px 0px 16px 16px",
          padding:`0px ${SPACE.s}px ${SPACE.s}px`,
        }}>
          <TypeAheadInput
            placeholder="Search vegetables..."
            selectedItems={sel}
            onAdd={v => { const w = sel.filter(s => s !== "Any"); onChange([...w, v]); }}
          />
        </div>
      </div>
    </div>
  );
}
