import { C, SPACE, T, SHADOW } from "../tokens.js";

export default function CategoryTab({ label, icon, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display:"flex", flexDirection:"column",
      justifyContent:"center", alignItems:"center",
      padding:`${SPACE.xs}px ${SPACE.m}px`,
      gap:`${SPACE.xxs}px`,
      height:"64px", flexShrink:0,
      background: active ? C.textStrong : C.fill,
      border: active ? "none" : `1px solid ${C.strokeStrong}`,
      boxShadow: SHADOW.raised,
      borderRadius:"8px",
      cursor:"pointer", transition:"all 0.15s",
    }}>
      <div style={{ width:24, height:24, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        {icon && icon(active)}
      </div>
      <span style={{
        ...T.tiny,
        color: active ? "#FFFFFF" : C.textStrong,
        textAlign:"center",
        whiteSpace:"nowrap",
      }}>{label}</span>
    </button>
  );
}
