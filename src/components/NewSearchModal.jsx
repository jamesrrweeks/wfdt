import { C, SPACE, T, F } from "../tokens.js";
import ModalTemplate from "./ModalTemplate.jsx";

/**
 * NewSearchModal
 *
 * Fires when the user taps "New search" from the InputScreen sticky footer.
 * Shows the 3 generated meals with a tick if already saved in Supabase.
 * Tapping a recipe row navigates directly to that recipe.
 *
 * Props:
 *   meals          {Array}    — the current meals array from App.jsx
 *   savedMealNames {Set}      — Set of meal names already saved to Supabase
 *   onConfirm      {fn}       — called when user taps "Continue — clear recipes"
 *   onClose        {fn}       — called when user taps "Cancel" or backdrop
 *   onViewRecipe   {fn(meal)} — called when user taps a recipe row
 */
export default function NewSearchModal({ meals, savedMealNames, onConfirm, onClose, onViewRecipe }) {
  const ctaDark = {
    width:        "100%",
    padding:      `${SPACE.s}px`,
    borderRadius: "32px",
    border:       "none",
    background:   C.textStrong,
    color:        "#FFFFFF",
    fontFamily:   F,
    fontSize:     "16px",
    fontWeight:   "700",
    cursor:       "pointer",
  };

  const ctaOutlined = {
    width:        "100%",
    padding:      `${SPACE.s}px`,
    borderRadius: "32px",
    border:       `1.5px solid ${C.strokeStrong}`,
    background:   "transparent",
    color:        C.textStrong,
    fontFamily:   F,
    fontSize:     "16px",
    fontWeight:   "700",
    cursor:       "pointer",
  };

  return (
    <ModalTemplate onClose={onClose}>

      {/* ── Info block (top, flex: 1) ── */}
      <div style={{ display:"flex", flexDirection:"column", gap:`${SPACE.s}px`, width:"100%", flex:1 }}>

  

        {/* Heading */}
        <div style={{ ...T.h2, color:C.textStrong }}>
          Clear your recipes
        </div>

        {/* Body */}
        <div style={{ ...T.small, color:C.textWeak }}>
          Your ingredient selection will be cleared and any unsaved recipes will be deleted.
        </div>

        {/* Icon */}
        <div style={{
          width:"48px", height:"48px", borderRadius:"48px",
          background:"#FFF0ED", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
        }}>
          <span
            className="material-symbols-outlined"
            style={{ fontSize:"24px", color:C.red, fontVariationSettings:"'FILL' 1, 'wght' 500" }}
          >
            delete_sweep
          </span>
        </div>

        {/* Recipe rows */}
        <div style={{ display:"flex", flexDirection:"column", gap:`${SPACE.xxs}px`, width:"100%" }}>
          {(meals || []).map((meal, i) => {
            const saved = savedMealNames?.has(meal.name) ?? false;
            return (
              <button
                key={meal.id ?? i}
                onClick={() => onViewRecipe(meal)}
                style={{
                  display:"flex", alignItems:"center", gap:`${SPACE.s}px`,
                  padding:`${SPACE.xs}px ${SPACE.xs}px ${SPACE.xs}px ${SPACE.m}px`,
                  borderRadius:`${SPACE.xs}px`,
                  cursor:"pointer", background:"transparent", border:"none",
                  width:"100%", textAlign:"left",
                }}
                onMouseEnter={e => e.currentTarget.style.background = C.strokeWeak}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:C.textStrong, flexShrink:0 }} />
                <span style={{
                  flex:1, ...T.tiny, fontWeight:"700",
                  color:               saved ? C.textWeak : C.textStrong,
                  textDecoration:      saved ? "none" : "underline",
                  textUnderlineOffset: "2px",
                  textDecorationColor: C.strokeStrong,
                }}>
                  {meal.name}
                </span>
                {saved && (
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize:"18px", color:C.textStrong, fontVariationSettings:"'FILL' 1, 'wght' 500", flexShrink:0 }}
                  >
                    check_circle
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Actions block (bottom) ── */}
      <div style={{ display:"flex", flexDirection:"column", gap:`${SPACE.xs}px`, width:"100%" }}>
        <button style={ctaDark} onClick={onConfirm}>
          Continue and clear recipes
        </button>
        <button style={ctaOutlined} onClick={onClose}>
          Cancel
        </button>
      </div>

    </ModalTemplate>
  );
}
