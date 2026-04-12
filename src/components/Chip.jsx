import { C, SPACE, T } from "../tokens.js";

export default function Chip({ label, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      display:"flex", flexDirection:"row",
      justifyContent:"center", alignItems:"center",
      padding:`${SPACE.xs}px ${SPACE.s}px`,
      height:"36px", flexShrink:0,
      background: selected ? C.primary : C.background,
      border:`1px solid ${selected ? C.primary : C.strokeStrong}`,
      borderRadius:"32px",
      cursor:"pointer", transition:"all 0.15s",
    }}>
      <span style={{ ...T.tiny, color:C.textStrong, whiteSpace:"nowrap" }}>{label}</span>
    </button>
  );
}
