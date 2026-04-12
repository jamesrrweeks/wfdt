import { useState } from "react";
import { C, SPACE, T, F } from "../tokens.js";
import { SearchIcon } from "../icons.jsx";
import { TYPEAHEAD_INGREDIENTS } from "../data.jsx";

export default function TypeAheadInput({ placeholder, selectedItems, onAdd }) {
  const [val, setVal] = useState("");
  const confirm = (item) => { const v=(item||val).trim(); if(!v)return; onAdd(v); setVal(""); };
  const sugg = val.trim().length>=2
    ? TYPEAHEAD_INGREDIENTS.filter(s=>s.toLowerCase().includes(val.toLowerCase())&&!selectedItems.includes(s)).slice(0,5)
    : [];
  return (
    <div style={{ position:"relative" }}>
      <div style={{
        display:"flex", flexDirection:"row", alignItems:"center",
        padding:`${SPACE.xs}px ${SPACE.s}px`, gap:`${SPACE.xs}px`,
        height:"40px", background:C.background,
        border:`1px solid ${C.strokeStrong}`, borderRadius:"32px",
      }}>
        <div style={{ width:24, height:24, display:"flex", justifyContent:"center", alignItems:"center", flexShrink:0 }}>
          <SearchIcon color={C.textStrong}/>
        </div>
        <input
          value={val}
          onChange={e=>setVal(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter")confirm(); if(e.key==="Escape")setVal(""); }}
          placeholder={placeholder}
          style={{ flex:1, border:"none", outline:"none", background:"transparent", ...T.tiny, color:C.textStrong }}
        />
        {val.trim() && (
          <button onClick={()=>confirm()} style={{ width:24, height:24, borderRadius:"50%", background:C.textStrong, border:"none", color:C.primary, fontSize:"12px", cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>✓</button>
        )}
      </div>
      {sugg.length>0 && (
        <div style={{ position:"absolute", left:0, right:0, top:"100%", zIndex:20, background:C.background, border:`1px solid ${C.strokeStrong}`, borderRadius:"16px", marginTop:`${SPACE.xxs}px`, overflow:"hidden", boxShadow:C.shadow }}>
          {sugg.map(s=>(
            <button key={s} onClick={()=>confirm(s)}
              style={{ width:"100%", padding:`${SPACE.xs}px ${SPACE.s}px`, background:"none", border:"none", borderBottom:`1px solid ${C.strokeWeak}`, cursor:"pointer", textAlign:"left", ...T.tiny, color:C.textStrong, fontFamily:F }}
              onMouseEnter={e=>e.currentTarget.style.background=C.fill}
              onMouseLeave={e=>e.currentTarget.style.background="none"}
            >{s}</button>
          ))}
        </div>
      )}
    </div>
  );
}
