import { useState } from "react";
import { C, SPACE, T, F, SHADOW } from "../tokens.js";
import { supabase } from "../supabase.js";
import { BackArrowIcon, BookmarkIcon } from "../icons.jsx";
import IngredientTable    from "./IngredientTable.jsx";
import IngredientSwapModal from "./IngredientSwapModal.jsx";
import AmountEditModal     from "./AmountEditModal.jsx";
import RegenerateBar       from "./RegenerateBar.jsx";

export default function RecipeScreen({ meal, prefs, onBack }) {

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
  const [saved, setSaved]                 = useState(false);
  const [showAuth, setShowAuth]           = useState(false);
  const [email, setEmail]                 = useState("");
  const [codeSent, setCodeSent]           = useState(false);
  const [code, setCode]                   = useState("");
  const [emailLoading, setEmailLoading]   = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // ── Ingredient actions ──────────────────────────────────────────────────────

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

  // ── Regenerate method ───────────────────────────────────────────────────────

  const regenerateMethod = async () => {
    setRegenLoading(true);
    try {
      const ingList = ingredients.map(i => `${i.name}${i.amount ? " " + i.amount : ""}`).join(", ");
      const r = await fetch("/api/generate", {
        method:  "POST",
        headers: { "Content-Type": "application/json", "x-secret-token": import.meta.env.VITE_API_SECRET_TOKEN },
        body: JSON.stringify({
          model:      "claude-sonnet-4-20250514",
          max_tokens: 600,
          messages:   [{ role: "user", content: `You are a cooking assistant. The user modified ingredients for "${meal.name}". Updated ingredients: ${ingList}. Return ONLY a JSON array of 4-6 method steps as strings. No preamble. No markdown.` }],
        }),
      });
      const data = await r.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      if (Array.isArray(parsed)) setMethod(parsed);
    } catch (e) {
      console.error("Regen failed:", e);
    } finally {
      setRegenLoading(false);
      setHasEdits(false);
    }
  };

  // ── Save ────────────────────────────────────────────────────────────────────

  const handleSaveClick = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setSaved(true);
    } else {
      setShowAuth(true);
    }
  };

  const handleSendCode = async () => {
    setEmailLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    setEmailLoading(false);
    if (!error) setCodeSent(true);
  };

  const handleVerifyCode = async () => {
    setVerifyLoading(true);
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
    setVerifyLoading(false);
    if (!error) { setSaved(true); setShowAuth(false); }
  };

  // ── Info chips ──────────────────────────────────────────────────────────────

  const infoChips = [
    meal.cuisine,
    meal.time,
    meal.calories ? `${meal.calories} kcal` : null,
    prefs?.people ? `${prefs.people} serves` : null,
  ].filter(Boolean);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
<div style={{ minHeight: "100vh", paddingBottom: 120 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `${SPACE.m}px ${SPACE.s}px ${SPACE.xs}px` }}>
        <button
          onClick={onBack}
          style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: "5px 0" }}
        >
          <BackArrowIcon />
          <span style={{ ...T.tiny, color: C.textWeak, textDecoration: "underline" }}>Back</span>
        </button>

        <button
          onClick={handleSaveClick}
          style={{ width: 48, height: 48, borderRadius: "50%", background: C.background, border: `1px solid ${C.strokeWeak}`, boxShadow: SHADOW.overlay, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <BookmarkIcon filled={saved} />
        </button>
      </div>

      {/* Title + info chips */}
      <div style={{ padding: `0 ${SPACE.s}px ${SPACE.m}px`, display: "flex", flexDirection: "column", gap: SPACE.s }}>
        <h1 style={{ ...T.h1, color: C.textStrong, margin: 0 }}>{meal.name}</h1>
        {infoChips.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {infoChips.map((chip, i) => (
              <span key={i} style={{ background: C.primaryMuted, borderRadius: 8, padding: "3px 16px", ...T.tiny, color: C.textStrong }}>
                {chip}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: `0 ${SPACE.s}px`, display: "flex", flexDirection: "column", gap: SPACE.m }}>

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

      {/* Auth sheet */}
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
                <button onClick={handleSendCode} disabled={emailLoading}
                  style={{ padding: "14px", borderRadius: 100, border: "none", background: C.primary, color: C.textStrong, fontFamily: F, fontWeight: "700", fontSize: 15, cursor: "pointer" }}>
                  {emailLoading ? "Sending…" : "Send code"}
                </button>
              </>
            ) : (
              <>
                <p style={{ ...T.tiny, color: C.textStrong, margin: 0 }}>Enter the 6-digit code sent to {email}.</p>
                <input type="text" placeholder="000000" value={code} onChange={e => setCode(e.target.value)} maxLength={6}
                  style={{ padding: "12px 16px", borderRadius: 100, border: `1.5px solid ${C.strokeStrong}`, fontFamily: F, fontSize: 14, color: C.textStrong, background: C.background, outline: "none", letterSpacing: "0.3em", textAlign: "center" }} />
                <button onClick={handleVerifyCode} disabled={verifyLoading}
                  style={{ padding: "14px", borderRadius: 100, border: "none", background: C.primary, color: C.textStrong, fontFamily: F, fontWeight: "700", fontSize: 15, cursor: "pointer" }}>
                  {verifyLoading ? "Verifying…" : "Verify & save"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
