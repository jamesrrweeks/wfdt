import { C, F } from "../tokens.js";

export default function MacroBar({ protein, carbs, fat, calories, size="sm" }) {
  const h = size === "lg" ? "6px" : "4px";
  const fs = size === "lg" ? "12px" : "11px";
  const toG = (pct, k) => Math.round((pct/100)*calories/k);
  const showG = !!calories;
  const items = showG
    ? [["P", toG(protein,4), "g", "#7BB8F0"], ["C", toG(carbs,4), "g", C.lime], ["F", toG(fat,9), "g", "#F0A87B"]]
    : [["P", protein, "%", "#7BB8F0"], ["C", carbs, "%", C.lime], ["F", fat, "%", "#F0A87B"]];
  return (
    <div>
      <div style={{ display:"flex", height:h, borderRadius:"4px", overflow:"hidden", gap:"1px" }}>
        <div style={{ width:`${protein}%`, background:"#7BB8F0" }}/>
        <div style={{ width:`${carbs}%`,   background:C.lime }}/>
        <div style={{ width:`${fat}%`,     background:"#F0A87B" }}/>
      </div>
      <div style={{ display:"flex", gap:"12px", marginTop:"6px" }}>
        {items.map(([l,v,u,col]) => (
          <div key={l} style={{ display:"flex", alignItems:"center", gap:"4px" }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:col }}/>
            <span style={{ fontSize:fs, color:C.muted, fontFamily:F }}>{l} <strong style={{ color:C.textStrong }}>{v}{u}</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
}
