import { C, SPACE, T, F } from "../tokens.js";
import { MACRO_PRESETS, DEFAULT_MACROS } from "../data.jsx";
import MacroBar from "./MacroBar.jsx";

export function CalorieSlider({ value, onChange }) {
  const min=200, max=900;
  const pct = ((value-min)/(max-min))*100;
  const lbl = value<=350?"Light":value<=550?"Medium":value<=750?"Hearty":"Feast";
  const lc  = value<=350?"#6BAE8A":value<=550?C.textStrong:value<=750?"#C47B2B":"#B94040";
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"14px" }}>
        <div><span style={{ fontSize:"32px", fontWeight:"700", color:C.textStrong, fontFamily:F }}>{value}</span><span style={{ fontSize:"14px", color:C.muted, fontFamily:F, marginLeft:"4px" }}>kcal</span></div>
        <span style={{ fontSize:"13px", fontWeight:"700", color:lc, fontFamily:F }}>{lbl}</span>
      </div>
      <div style={{ position:"relative", height:"4px", borderRadius:"4px", background:C.strokeStrong, marginBottom:"12px" }}>
        <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${pct}%`, background:C.textStrong, borderRadius:"4px" }}/>
        <input type="range" min={min} max={max} step={25} value={value} onChange={e=>onChange(Number(e.target.value))} style={{ position:"absolute", top:"50%", left:0, transform:"translateY(-50%)", width:"100%", opacity:0, cursor:"pointer", height:"28px", margin:0 }}/>
        <div style={{ position:"absolute", top:"50%", left:`${pct}%`, transform:"translate(-50%,-50%)", width:"22px", height:"22px", borderRadius:"50%", background:C.textStrong, border:`3px solid ${C.strokeWeak}`, boxShadow:"0 1px 4px rgba(0,0,0,0.15)", pointerEvents:"none" }}/>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:"11px", color:C.muted, fontFamily:F }}>200 kcal</span>
        <div style={{ display:"flex", gap:"8px" }}>
          {[-1,+1].map(d => (
            <div key={d} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"2px" }}>
              <button onClick={()=>onChange(Math.min(max,Math.max(min,value+d*25)))} style={{ width:30, height:30, borderRadius:"50%", border:`1.5px solid ${C.strokeStrong}`, background:"transparent", fontSize:"16px", cursor:"pointer", color:C.textStrong, display:"flex", alignItems:"center", justifyContent:"center" }}>{d<0?"−":"+"}</button>
              <span style={{ fontSize:"9px", color:C.muted, fontFamily:F }}>25 kcal</span>
            </div>
          ))}
        </div>
        <span style={{ fontSize:"11px", color:C.muted, fontFamily:F }}>900 kcal</span>
      </div>
    </div>
  );
}

export default function MacroSelector({ value, onChange }) {
  const macros = value || DEFAULT_MACROS;
  const adjust = (key, dir) => {
    const nv = Math.min(90, Math.max(5, macros[key]+dir*5));
    const diff = nv - macros[key]; if (!diff) return;
    const others = Object.keys(macros).filter(k=>k!==key);
    const ot = others.reduce((s,k)=>s+macros[k],0);
    let u = { ...macros, [key]:nv };
    if (ot>0) others.forEach(k=>{ u[k]=Math.max(5,Math.round(macros[k]-diff*(macros[k]/ot))); });
    const t = Object.values(u).reduce((s,v)=>s+v,0), d2=100-t;
    if (d2) { const fk=others.find(k=>u[k]+d2>=5)||others[0]; u[fk]=Math.max(5,u[fk]+d2); }
    onChange(u);
  };

  const MS = ({ label, k, color }) => (
    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:`${SPACE.xs}px` }}>
      <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
        <div style={{ width:8, height:8, borderRadius:"50%", background:color }}/>
        <span style={{ fontSize:"10px", fontWeight:"700", color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", fontFamily:F }}>{label}</span>
      </div>
      <span style={{ fontSize:"22px", fontWeight:"700", color:C.textStrong, fontFamily:F }}>{macros[k]}%</span>
      <div style={{ display:"flex", gap:`${SPACE.xs}px` }}>
        {[-1,+1].map(d=><button key={d} onClick={()=>adjust(k,d)} style={{ width:26, height:26, borderRadius:"50%", border:`1.5px solid ${C.strokeStrong}`, background:"transparent", fontSize:"14px", cursor:"pointer", color:C.textStrong, display:"flex", alignItems:"center", justifyContent:"center" }}>{d<0?"−":"+"}</button>)}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ fontSize:"10px", fontWeight:"700", letterSpacing:"0.1em", textTransform:"uppercase", color:C.muted, fontFamily:F, marginBottom:"12px" }}>⚖️ Macro ratio</div>
      <div style={{ display:"flex", gap:"8px", overflowX:"auto", paddingBottom:"10px" }}>
        {MACRO_PRESETS.map(p => {
          const sel = macros.protein===p.protein&&macros.carbs===p.carbs&&macros.fat===p.fat;
          return <button key={p.name} onClick={()=>onChange({protein:p.protein,carbs:p.carbs,fat:p.fat})} style={{ padding:"6px 14px", borderRadius:"100px", flexShrink:0, border:`1.5px solid ${sel?C.textStrong:C.strokeStrong}`, background:sel?C.textStrong:"transparent", color:sel?C.background:C.textStrong, fontSize:"12px", fontFamily:F, fontWeight:sel?"700":"400", cursor:"pointer", whiteSpace:"nowrap" }}>{p.name}</button>;
        })}
      </div>
      <div style={{ background:C.background, borderRadius:"16px", padding:"16px", border:`1px solid ${C.strokeStrong}` }}>
        <div style={{ display:"flex", gap:"8px", marginBottom:`${SPACE.s}px` }}>
          <MS label="Protein" k="protein" color="#7BB8F0"/>
          <div style={{ width:"1px", background:C.strokeStrong }}/>
          <MS label="Carbs" k="carbs" color={C.primary}/>
          <div style={{ width:"1px", background:C.strokeStrong }}/>
          <MS label="Fat" k="fat" color="#F0A87B"/>
        </div>
        <MacroBar protein={macros.protein} carbs={macros.carbs} fat={macros.fat}/>
      </div>
    </div>
  );
}
