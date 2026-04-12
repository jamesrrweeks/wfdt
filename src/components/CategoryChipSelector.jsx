import { useState } from "react";
import { C, SPACE, T, F, SHADOW } from "../tokens.js";
import CategoryTab from "./CategoryTab.jsx";
import TypeAheadInput from "./TypeAheadInput.jsx";

export default function CategoryChipSelector({ label, categories, selected, onChange }) {
  const cats = Object.keys(categories);
  const [active, setActive] = useState(cats[0]);
  const sel = selected.filter(s=>s!=="Any");

  const toggle = (item) => {
    if(item==="No carbs"){ onChange(["No carbs"]); return; }
    const without = sel.filter(s=>s!=="No carbs"&&s!=="Any");
    const next = without.includes(item) ? without.filter(s=>s!==item) : [...without, item];
    onChange(next.length===0 ? ["Any"] : next);
  };

  const items = categories[active]?.items || [];

  return (
    <div>
      <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:`${SPACE.xs}px` }}>
        <div style={{ ...T.small, fontWeight:"700", color:C.textStrong }}>{label}</div>
        {sel.length>0 && <button onClick={()=>onChange(["Any"])} style={{ background:"none", border:"none", cursor:"pointer", ...T.tiny, color:C.muted, fontFamily:F, textDecoration:"underline" }}>Clear</button>}
      </div>
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
      <div style={{
        display:"flex", flexDirection:"column",
        background:C.fill, border:`1px solid ${C.strokeStrong}`,
        borderRadius:"16px", boxShadow:SHADOW.overlay, overflow:"hidden",
      }}>
        <div style={{
          display:"flex", flexWrap:"wrap",
          padding:`${SPACE.m}px ${SPACE.s}px`, gap:`${SPACE.xs}px`,
        }}>
          {items.map(item => {
            const isS = sel.includes(item);
            return (
              <button key={item} onClick={()=>toggle(item)} style={{
                display:"flex", justifyContent:"center", alignItems:"center",
                padding:`${SPACE.xs}px ${SPACE.s}px`, height:"36px",
                borderRadius:"32px", cursor:"pointer",
                border:`1px solid ${isS ? C.primary : C.strokeStrong}`,
                background: isS ? C.primary : C.background,
                transition:"all 0.12s",
              }}>
                <span style={{ ...T.tiny, color:C.textStrong, whiteSpace:"nowrap" }}>{item}</span>
              </button>
            );
          })}
        </div>
        <div style={{ padding:`0px ${SPACE.s}px ${SPACE.s}px` }}>
          <TypeAheadInput
            placeholder={`Search ${active.toLowerCase()}...`}
            selectedItems={sel}
            onAdd={v=>{ const w=sel.filter(s=>s!=="Any"&&s!=="No carbs"); onChange([...w,v]); }}
          />
        </div>
      </div>
    </div>
  );
}
