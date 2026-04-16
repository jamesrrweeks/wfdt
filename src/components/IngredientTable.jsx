import { C, SPACE, T, F, SHADOW } from "../tokens.js";
import { CloseSmallIcon } from "../icons.jsx";

export default function IngredientTable({ ingredients, onSwapOpen, onAmountOpen, onRemove }) {
  const tagNameStyle = (source) => ({
    fontFamily:   F,
    fontSize:     14,
    lineHeight:   "20px",
    fontWeight:   "400",
    color:        C.textStrong,
    background:   source === "user" ? C.primaryMuted : C.strokeWeak,
    border:       "none",
    borderRadius: 8,
    padding:      "3px 16px",
    height:       30,
    display:      "inline-flex",
    alignItems:   "center",
    cursor:       "pointer",
    width:        "fit-content",
    whiteSpace:   "nowrap",
    transition:   "background 0.15s",
  });

  const tagAmountStyle = {
    fontFamily:   F,
    fontSize:     14,
    lineHeight:   "20px",
    fontWeight:   "400",
    color:        C.textStrong,
    background:   C.strokeWeak,
    borderRadius: 8,
    padding:      "3px 16px",
    height:       30,
    display:      "inline-flex",
    alignItems:   "center",
    whiteSpace:   "nowrap",
    width:        "fit-content",
    cursor:       "pointer",
    border:       "none",
    transition:   "background 0.15s",
  };

  const rowStyle = {
    display:             "grid",
    gridTemplateColumns: "1fr 110px 32px",
    alignItems:          "center",
  };

  return (
    <div style={{
      background:    C.background,
      boxShadow:     SHADOW.overlay,
      borderRadius:  16,
      padding:       SPACE.s,
      display:       "flex",
      flexDirection: "column",
      gap:           12,
    }}>
      <div style={rowStyle}>
        <span style={{ ...T.tiny, color: C.textWeak }}>Item</span>
        <span style={{ ...T.tiny, color: C.textWeak }}>Amount</span>
        <span />
      </div>

      {ingredients.map((ing, i) => (
        <div key={i} style={rowStyle}>
          <button style={tagNameStyle(ing.source)} onClick={() => onSwapOpen(ing, i)}>
            {ing.name}
          </button>
          <button style={tagAmountStyle} onClick={() => onAmountOpen(ing, i)}>
            {ing.amount}
          </button>
          <button
            onClick={() => onRemove(i)}
            style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", justifySelf: "center", background: "none", border: "none", cursor: "pointer", borderRadius: 4, padding: 0 }}
          >
            <CloseSmallIcon />
          </button>
        </div>
      ))}
    </div>
  );
}
