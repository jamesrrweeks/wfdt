import { useState } from "react";
import { C, SPACE, T, F } from "../tokens.js";
import IngredientTable     from "./IngredientTable.jsx";
import IngredientSwapModal from "./IngredientSwapModal.jsx";
import AmountEditModal     from "./AmountEditModal.jsx";
import RegenerateBar       from "./RegenerateBar.jsx";

export default function RecipeScreen({ meal, prefs }) {

  const toIngObj = (ing) => {
    if (typeof ing === "object" && ing.name) return ing;
    const parts = ing.trim().match(/^(.*?)\s+([\d.]+\s*\S*)$/);
    if (parts) return { name: parts[1], amount: parts[2], source: "user" };
    return { name: ing, amount: "", source: "user" };
  };

  const initialIngredients = [
    ...(meal.ingredients || []).map(i => toIngObj(i)),
    ...(meal.pantryUsed  || []).map(i => ({ ...toIngObj(i), source: "ai" })),
  ];

  const [ingredients, setIngredients]     = useState(initialIngredients);
  const [method, setMethod]               = useState(meal.method || []);
  const [hasEdits, setHasEdits]           = useState(false);
  const [regenLoading, setRegenLoading]   = useState(false);
  const [swapTarget, setSwapTarget]       = useState(null);
  const [amountTarget, setAmountTarget]   = useState(null);
  const [showAuth, setShowAuth]           = useState(false);
  const [email, setEmail]                 = useState("");
  const [codeSent, setCodeSent]           = useState(false);
  const [code, setCode]                   = useState("");
  const [emailLoading, setEmailLoading]   = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const handleRemove = (index) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
    setHasEdits(true);
  };

  const handleSwapConfirm = (updatedIng) => {
    setIngredients(prev => prev.map((ing, i) => i === swapTarget.index ? updatedIng : ing));
    setSwapTarget(null);
    setHasEdits(true);
  };

  const handleAmountConfirm = (updatedIng) => {
    setIngredients(prev => prev.map((ing, i) => i === amountTarget.index ? updatedIng : ing));
    setAmountTarget(null);
    setHasEdits(true);
  };

  const regenerateMethod = async () => {
    setRegenLoading(true);
    try {
      const ingList = ingredients.map(i => `${i.name}${i.amount ? " " + i.amount : ""}`).join(", ");
      const r = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-secret-token": import.meta.env.VITE_API_SECRET_TOKEN,
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: `Rewrite the method for "${meal.name}" using these ingredients: ${ingList}. Return only a JSON array of method step strings.` }],
        }),
      });
      const d = await r.json();
      const t = d.content[0].text;
      const c = t.replace(/```json|```/g, "").trim();
      setMethod(JSON.parse(c));
    } catch (e) {
      console.error(e);
    } finally {
      setRegenLoading(false);
      setHasEdits(false);
    }
  };

  return (
    <>
      {/* Ingredients */}
      <div style={{ display: "flex", flexDirection: "column", gap: SPACE.s }}>
        <h2 style={{ ...T.h3, color: C.textStrong, margin: 0 }}>Ingredients</h2>
        <IngredientTable
          ingredients={ingredients}
          onSwapOpen={(ing, index)   => setSwapTarget({ ingredient: ing, index })}
          onAmountOpen={(ing, index) => setAmountTarget({ ingredient: ing, index })}
          onRemove={handleRemove}
        />
      </div>

      {/* Method */}
      <div style={{ display: "flex", flexDirection: "column", gap: SPACE.s }}>
        <h2 style={{ ...T.h3, color: C.textStrong, margin: 0 }}>Method</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: SPACE.s }}>
          {method.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 32, height: 32, minWidth: 32, borderRadius: "50%", background: C.primaryMuted, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 4, flexShrink: 0 }}>
                <span style={{ ...T.small, fontWeight: "700", color: C.textStrong, lineHeight: 1 }}>{i + 1}</span>
              </div>
              <span style={{ ...T.small, color: C.textStrong, flex: 1 }}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <IngredientSwapModal
        ingredient={swapTarget?.ingredient || null}
        onConfirm={handleSwapConfirm}
        onClose={() => setSwapTarget(null)}
      />
      <AmountEditModal
        ingredient={amountTarget?.ingredient || null}
        onConfirm={handleAmountConfirm}
        onClose={() => setAmountTarget(null)}
      />

      {/* Regen bar */}
      <RegenerateBar
        visible={hasEdits}
        loading={regenLoading}
        onRegenerate={regenerateMethod}
      />

      {/* Auth sheet — stays here until dedicated session */}
      {showAuth && (
        <div onClick={() => setShowAuth(false)} style={{ position: "fixed", inset: 0, background: "rgba(61,51,26,0.4)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "390px", background: C.background, borderRadius: "20px 20px 0 0", padding: "32px 24px 48px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ ...T.tiny, fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: C.muted }}>Save recipe</span>
              <button onClick={() => setShowAuth(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.muted, padding: 0 }}>✕</button>
            </div>
            {!codeSent ? (
              <>
                <p style={{ ...T.tiny, color: C.textStrong, margin: 0 }}>Enter your email to save this recipe.</p>
                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ padding: "12px 16px", borderRadius: 100, border: `1.5px solid ${C.strokeStrong}`, fontFamily: F, fontSize: 14, color: C.textStrong, background: C.background, outline: "none" }} />
                <button disabled={emailLoading}
                  style={{ padding: "14px", borderRadius: 100, border: "none", background: C.primary, color: C.textStrong, fontFamily: F, fontWeight: "700", fontSize: 15, cursor: "pointer" }}>
                  {emailLoading ? "Sending..." : "Send code"}
                </button>
              </>
            ) : (
              <>
                <p style={{ ...T.tiny, color: C.textStrong, margin: 0 }}>Enter the 6-digit code we sent to {email}.</p>
                <input type="text" placeholder="123456" value={code} onChange={e => setCode(e.target.value)}
                  style={{ padding: "12px 16px", borderRadius: 100, border: `1.5px solid ${C.strokeStrong}`, fontFamily: F, fontSize: 14, color: C.textStrong, background: C.background, outline: "none" }} />
                <button disabled={verifyLoading}
                  style={{ padding: "14px", borderRadius: 100, border: "none", background: C.primary, color: C.textStrong, fontFamily: F, fontWeight: "700", fontSize: 15, cursor: "pointer" }}>
                  {verifyLoading ? "Verifying..." : "Verify"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
