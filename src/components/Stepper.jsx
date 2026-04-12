import { C, SPACE, F } from "../tokens.js";
import { PlusIcon, MinusIcon } from "../icons.jsx";

export default function Stepper({ value, onChange }) {
  const btnBase = {
    display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",
    padding:"10px", width:"44px", height:"40px",
    background:C.fill, border:`1px solid ${C.strokeStrong}`,
    cursor:"pointer", flexShrink:0,
  };
  return (
    <div style={{ display:"flex", flexDirection:"row", alignItems:"flex-start", width:"120px", height:"40px" }}>
      <button onClick={()=>onChange(Math.max(1,value-1))} style={{ ...btnBase, borderRadius:"48px 0px 0px 48px" }}>
        <MinusIcon/>
      </button>
      <div style={{
        display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",
        padding:"10px", width:"31px", height:"40px", flexShrink:0,
        background:C.background, borderWidth:"1px 0px", borderStyle:"solid", borderColor:C.strokeStrong,
      }}>
        <span style={{ fontSize:"15px", fontWeight:"700", color:C.textStrong, fontFamily:F, lineHeight:1 }}>{value}</span>
      </div>
      <button onClick={()=>onChange(Math.min(8,value+1))} style={{ ...btnBase, borderRadius:"0px 48px 48px 0px" }}>
        <PlusIcon/>
      </button>
    </div>
  );
}
