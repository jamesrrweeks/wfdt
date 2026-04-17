import { C, SPACE, T } from "../tokens.js";

export default function Chip({ label, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      display:"flex", justifyContent:"center", alignItems:"center",
      padding:`3px ${SPACE.s}px`,
      height:"36px",
      borderRadius:"8px",
      border:"none",
      background: selected ? C.primaryMuted : C.strokeWeak,
      cursor:"pointer",
      transition:"all 0.12s",
    }}>
      <span style={{ ...T.tiny, color:C.textStrong, whiteSpace:"nowrap" }}>{label}</span>
    </button>
  );
}
