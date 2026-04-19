import { C, SPACE, T, F } from "../tokens.js";
import ModalTemplate from "./ModalTemplate.jsx";

export default function NewSearchModal({ meals, savedMealNames, onConfirm, onClose, onViewRecipe }) {

  const ctaDark = {
    width:        "100%",
    height:       "48px",
    borderRadius: "32px",
    border:       "none",
    background:   C.textStrong,
    color:        "#FAF8F5",
    fontFamily:   F,
    fontSize:     "16px",
    fontWeight:   "700",
    cursor:       "pointer",
  };

  const ctaOutlined = {
    width:        "100%",
    height:       "48px",
    borderRadius: "32px",
    border:       `1px solid ${C.strokeStrong}`,
    background:   C.background,
    color:        C.textStrong,
    fontFamily:   F,
    fontSize:     "16px",
    fontWeight:   "700",
    cursor:       "pointer",
  };

  return (
    <ModalTemplate onClose={onClose}>

      {/* ── Info block ── */}
      <div style={{ display:"flex", flexDirection:"column", gap:`${SPACE.s}px`, width:"100%", flex:1 }}>

        {/* Heading — Gasoek One H1 */}
        <div style={{ ...T.h1, color:C.textStrong }}>
          Clear your recipes
        </div>

        {/* Body */}
        <div style={{ ...T.small, color:C.textWeak }}>
          Your ingredient selection will be cleared and any unsaved recipes will be deleted.
        </div>

        {/* Recipe list */}
        <ul style={{ margin:0, paddingLeft:"24px", display:"flex", flexDirection:"column", gap:"0px" }}>
          {(meals || []).map((meal, i) => {
            const saved = savedMealNames?.has(meal.name) ?? false;
            return (
              <li key={meal.id ?? i} style={{ marginBottom:"0" }}>
                <button
                  onClick={() => onViewRecipe(meal)}
                  style={{
                    background:          "none",
                    border:              "none",
                    padding:             "0",
                    cursor:              "pointer",
                    fontFamily:          F,
                    fontSize:            "20px",
                    fontWeight:          "700",
                    lineHeight:          "28px",
                    color:               saved ? C.textWeak : C.textStrong,
                    textDecoration:      "underline",
                    textUnderlineOffset: "2px",
                  }}
                >
                  {meal.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── Actions block — Cancel first, then Confirm ── */}
      <div style={{ display:"flex", flexDirection:"column", gap:`${SPACE.s}px`, width:"100%" }}>
        <button style={ctaOutlined} onClick={onClose}>
          Cancel
        </button>
        <button style={ctaDark} onClick={onConfirm}>
          Continue and clear recipes
        </button>
      </div>

    </ModalTemplate>
  );
}
