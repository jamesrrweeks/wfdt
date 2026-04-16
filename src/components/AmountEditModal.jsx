import { useState, useEffect } from "react";
import { C, SPACE, T, F, SHADOW } from "../tokens.js";

const UNITS = ["g", "kg", "ml", "L", "tsp", "tbsp", "whole", "cloves", "sprigs", "cups"];

function parseAmount(str) {
  const match = (str || "").trim().match(/^([\d.]+)\s*(.*)$/);
  if (match) return { num: match[1], unit: match[2].trim() || "g" };
  return { num: "", unit: "g" };
}

const BackspaceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M21 4H7L0 12L7 20H21C22.1 20 23 19.1 23 18V6C23 4.9 22.1 4 21 4Z" stroke={C.strokeStrong} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 9L12 15M12 9L18 15" stroke={C.strokeStrong} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default function AmountEditModal({ ingredient, onConfirm, onClose }) {
  // ingredient = { name, amount, source }
  const [numVal, setNumVal] = useState("");
  const [unit, setUnit]     = useState("g");

  useEffect(() => {
    if (!ingredient) return;
    const parsed = parseAmount(ingredient.amount);
    setNumVal(parsed.num);
    setUnit(parsed.unit);
  }, [ingredient]);

  if (!ingredient) return null;

  const keyPress = (val) => {
    if (val === "." && numVal.includes(".")) return;
    if (numVal === "0" && val !== ".") { setNumVal(val); return; }
    if (numVal.length >= 6) return;
    setNumVal(prev => prev + val);
  };

  const backspace = () => setNumVal(prev => prev.slice(0, -1));

  const handleConfirm = () => {
    if (!numVal) return;
    onConfirm({ ...ingredient, amount: `${numVal}${unit}` });
  };

  const keyStyle = (action = false) => ({
    height:         52,
    borderRadius:   12,
    border:         action ? `1px solid ${C.strokeWeak}` : "none",
    background:     action ? C.background : C.strokeWeak,
    fontFamily:     F,
    fontSize:       action ? 16 : 20,
    fontWeight:     "700",
    color:          action ? C.textWeak : C.textStrong,
    cursor:         "pointer",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    userSelect:     "none",
    transition:     "background 0.12s",
  });

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset:    0,
          background: "rgba(61,51,26,0.4)",
          zIndex:   99,
        }}
      />

      {/* Sheet */}
      <div style={{
        position:      "fixed",
        bottom:        0,
        left:          "50%",
        transform:     "translateX(-50%)",
        width:         "390px",
        background:    C.background,
        border:        `1px solid ${C.strokeWeak}`,
        borderRadius:  "24px 24px 0 0",
        boxShadow:     SHADOW.overlay,
        zIndex:        100,
        display:       "flex",
        flexDirection: "column",
        alignItems:    "stretch",
        padding:       `${SPACE.xl}px ${SPACE.m}px ${SPACE.xl}px`,
        gap:           `${SPACE.s}px`,
      }}>

        {/* Drag handle */}
        <div style={{
          position:     "absolute",
          top:          12,
          left:         "50%",
          transform:    "translateX(-50%)",
          width:        65,
          height:       7,
          background:   C.strokeStrong,
          borderRadius: 8,
        }} />

        {/* Amount display */}
        <div style={{ display: "flex", alignItems: "baseline", gap: SPACE.xs, minHeight: 48, marginTop: SPACE.xs }}>
          <span style={{ fontFamily: F, fontSize: 32, lineHeight: "40px", fontWeight: "700", color: C.textStrong, minWidth: 60 }}>
            {numVal || "0"}
          </span>
          <span style={{ ...T.h3, color: C.textWeak }}>
            {unit}
          </span>
        </div>

        {/* Unit chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: SPACE.xs }}>
          {UNITS.map(u => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              style={{
                display:        "flex",
                justifyContent: "center",
                alignItems:     "center",
                padding:        "3px 16px",
                height:         30,
                background:     unit === u ? C.textStrong : C.strokeWeak,
                borderRadius:   8,
                border:         "none",
                cursor:         "pointer",
                fontFamily:     F,
                fontSize:       14,
                color:          unit === u ? C.fill : C.textStrong,
                whiteSpace:     "nowrap",
                transition:     "background 0.15s",
              }}
            >
              {u}
            </button>
          ))}
        </div>

        {/* Number pad */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: SPACE.xs }}>
          {["1","2","3","4","5","6","7","8","9"].map(n => (
            <button key={n} onClick={() => keyPress(n)} style={keyStyle()}>{n}</button>
          ))}
          <button onClick={() => keyPress(".")} style={keyStyle(true)}>.</button>
          <button onClick={() => keyPress("0")} style={keyStyle()}>0</button>
          <button onClick={backspace} style={keyStyle(true)}><BackspaceIcon /></button>
        </div>

        {/* Confirm */}
        <button
          onClick={handleConfirm}
          disabled={!numVal}
          style={{
            display:        "flex",
            justifyContent: "center",
            alignItems:     "center",
            height:         48,
            background:     numVal ? C.primary : C.strokeWeak,
            borderRadius:   32,
            border:         "none",
            cursor:         numVal ? "pointer" : "default",
            fontFamily:     F,
            fontWeight:     "700",
            fontSize:       16,
            lineHeight:     "24px",
            color:          numVal ? C.textStrong : C.strokeStrong,
            transition:     "background 0.15s",
          }}
        >
          Update amount
        </button>

      </div>
    </>
  );
}
