import { useState, useEffect } from "react";
import { C, SPACE, T, F, SHADOW } from "../tokens.js";

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke={C.textStrong} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 21L16.65 16.65" stroke={C.textStrong} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function IngredientSwapModal({ ingredient, onConfirm, onClose }) {
  // ingredient = { name, amount, source, suggestions: string[] }
  const [selectedChip, setSelectedChip] = useState(null);
  const [customValue, setCustomValue]   = useState("");

  useEffect(() => {
    setSelectedChip(null);
    setCustomValue("");
  }, [ingredient]);

  if (!ingredient) return null;

  const chips = ingredient.suggestions || [];

  const handleChip = (label) => {
    setSelectedChip(label);
    setCustomValue("");
  };

  const handleCustom = (e) => {
    setCustomValue(e.target.value);
    setSelectedChip(null);
  };

  const swapTo    = selectedChip || customValue.trim();
  const ctaLabel  = swapTo ? `Swap for ${swapTo}` : "Swap ingredient";

  const handleConfirm = () => {
    if (!swapTo) return;
    onConfirm({ ...ingredient, name: swapTo, source: "user" });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position:   "fixed",
          inset:      0,
          background: "rgba(61,51,26,0.4)",
          zIndex:     99,
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
        alignItems:    "flex-start",
        padding:       `${SPACE.xl}px ${SPACE.m}px ${SPACE.xxl}px`,
        gap:           `${SPACE.m}px`,
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

        {/* Ingredient name */}
        <p style={{ ...T.h1, color: C.textStrong, width: "100%", margin: 0 }}>
          {ingredient.name}
        </p>

        {/* Swapper */}
        <div style={{
          display:       "flex",
          flexDirection: "row",
          flexWrap:      "wrap",
          alignItems:    "center",
          alignContent:  "flex-start",
          gap:           `${SPACE.xs}px`,
          width:         "100%",
        }}>

          <span style={{ ...T.small, fontWeight: "700", color: C.textStrong, width: "100%", flexShrink: 0 }}>
            Swap suggestions
          </span>

          {/* AI-generated suggestion chips */}
          {chips.map(label => (
            <button
              key={label}
              onClick={() => handleChip(label)}
              style={{
                display:        "flex",
                justifyContent: "center",
                alignItems:     "center",
                padding:        "3px 16px",
                height:         30,
                background:     selectedChip === label ? C.primary : C.strokeWeak,
                borderRadius:   8,
                border:         "none",
                cursor:         "pointer",
                fontFamily:     F,
                fontSize:       14,
                lineHeight:     "20px",
                color:          C.textStrong,
                whiteSpace:     "nowrap",
                transition:     "background 0.15s",
              }}
            >
              {label}
            </button>
          ))}

          {/* Custom input */}
          <div style={{
            boxSizing:     "border-box",
            display:       "flex",
            flexDirection: "row",
            alignItems:    "center",
            padding:       "8px 16px",
            gap:           `${SPACE.xs}px`,
            width:         "100%",
            height:        40,
            background:    C.background,
            border:        `1px solid ${C.strokeStrong}`,
            borderRadius:  32,
            flexShrink:    0,
          }}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Or type your own…"
              value={customValue}
              onChange={handleCustom}
              style={{
                border:     "none",
                outline:    "none",
                fontFamily: F,
                fontSize:   14,
                lineHeight: "20px",
                color:      C.textStrong,
                background: "transparent",
                width:      "100%",
              }}
            />
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleConfirm}
          disabled={!swapTo}
          style={{
            display:        "flex",
            justifyContent: "center",
            alignItems:     "center",
            padding:        "8px 16px",
            width:          "100%",
            height:         48,
            background:     swapTo ? C.primary : C.strokeWeak,
            borderRadius:   32,
            border:         "none",
            cursor:         swapTo ? "pointer" : "default",
            fontFamily:     F,
            fontWeight:     "700",
            fontSize:       16,
            lineHeight:     "24px",
            color:          swapTo ? C.textStrong : C.strokeStrong,
            transition:     "background 0.15s",
          }}
        >
          {ctaLabel}
        </button>

      </div>
    </>
  );
}
