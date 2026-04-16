import { useState } from "react";
import { C, SPACE, T, F, FD, SHADOW } from "../tokens.js";
import MacroBar from "./MacroBar.jsx";
import Chip from "./Chip.jsx";
import IngredientSwapModal from "./IngredientSwapModal.jsx";
import AmountEditModal from "./AmountEditModal.jsx";
import RegenerateBar from "./RegenerateBar.jsx";
import { supabase } from "../supabase.js";

// ─── Close icon (×) ──────────────────────────────────────────────────────────
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M8.41245 16.9875L7.01245 15.5875L10.6125 11.9875L7.01245 8.41251L8.41245 7.01251L12.0125 10.6125L15.5875 7.01251L16.9875 8.41251L13.3875 11.9875L16.9875 15.5875L15.5875 16.9875L12.0125 13.3875L8.41245 16.9875Z" fill={C.strokeStrong}/>
  </svg>
);

// ─── Ingredient table ─────────────────────────────────────────────────────────
// Each ingredient: { name: string, amount: string, source: "user" | "ai" }

function IngredientTable({ ingredients, onSwapOpen, onAmountOpen, onRemove }) {
  const tagNameStyle = (source) => ({
    fontFamily:     F,
    fontSize:       14,
    lineHeight:     "20px",
    fontWeight:     "400",
    color:          C.textStrong,
    background:     source === "user" ? C.primaryMuted : C.strokeWeak,
    border:         "none",
    borderRadius:   8,
    padding:        "3px 16px",
    height:         30,
    display:        "inline-flex",
    alignItems:     "center",
    cursor:         "pointer",
    width:          "fit-content",
    whiteSpace:     "nowrap",
    transition:     "background 0.15s",
  });

  const tagAmountStyle = {
    fontFamily:     F,
    fontSize:       14,
    lineHeight:     "20px",
    fontWeight:     "400",
    color:          C.textStrong,
    background:     C.strokeWeak,
    borderRadius:   8,
    padding:        "3px 16px",
    height:         30,
    display:        "inline-flex",
    alignItems:     "center",
    whiteSpace:     "nowrap",
    width:          "fit-content",
    cursor:         "pointer",
    border:         "none",
    transition:     "background 0.15s",
  };

  const rowStyle = {
    display:     "grid",
    gridTemplateColumns: "1fr 110px 32px",
    alignItems:  "center",
  };

  return (
    <div style={{
      background:   C.background,
      boxShadow:    SHADOW.overlay,
      borderRadius: 16,
      padding:      SPACE.s,
      display:      "flex",
      flexDirection:"column",
      gap:          12,
    }}>
      {/* Column headers */}
      <div style={rowStyle}>
        <span style={{ ...T.tiny, color: C.textWeak }}>Item</span>
        <span style={{ ...T.tiny, color: C.textWeak }}>Amount</span>
        <span />
      </div>

      {/* Rows */}
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
            style={{
              width:          24,
              height:         24,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              justifySelf:    "center",
              background:     "none",
              border:         "none",
              cursor:         "pointer",
              borderRadius:   4,
              padding:        0,
            }}
          >
            <CloseIcon />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function RecipeScreen({ meal, onBack }) {

  // Build initial ingredient list from meal data.
  // Supports both new shape { name, amount, source } and legacy string arrays.
  const toIngObj = (ing) => {
    if (typeof ing === "object" && ing.name) return ing;
    // Legacy: plain string like "Chicken breast 400g"
    const parts = ing.trim().match(/^(.*?)\s+([\d.]+\s*\S*)$/);
    if (parts) return { name: parts[1], amount: parts[2], source: "user" };
    return { name: ing, amount: "", source: "user" };
  };

  const initialIngredients = [
    ...(meal.ingredients  || []).map(i => toIngObj(i)),
    ...(meal.pantryUsed   || []).map(i => ({ ...toIngObj(i), source: "ai" })),
  ];

  const [ingredients, setIngredients]   = useState(initialIngredients);
  const [method, setMethod]             = useState(meal.method || []);
  const [hasEdits, setHasEdits]         = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);

  // Modal state
  const [swapTarget, setSwapTarget]     = useState(null); // { ingredient, index }
  const [amountTarget, setAmountTarget] = useState(null); // { ingredient, index }

  // Auth / save state (preserved from original)
  const [copied, setCopied]             = useState(false);
  const [saved, setSaved]               = useState(false);
  const [showAuth, setShowAuth]         = useState(false);
  const [email, setEmail]               = useState("");
  const [codeSent, setCodeSent]         = useState(false);
  const [code, setCode]                 = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // ── Ingredient actions ────────────────────────────────────────────────────

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

  // ── Regenerate method ─────────────────────────────────────────────────────

  const regenerateMethod = async () => {
    setRegenLoading(true);
    try {
      const ingList = ingredients.map(i => `${i.name}${i.amount ? " " + i.amount : ""}`).join(", ");
      const r = await fetch("/api/generate", {
        method:  "POST",
        headers: {
          "Content-Type":   "application/json",
          "x-secret-token": import.meta.env.VITE_API_SECRET_TOKEN,
        },
        body: JSON.stringify({
          model:      "claude-sonnet-4-20250514",
          max_tokens: 600,
          messages: [{
            role:    "user",
            content: `You are a cooking assistant. The user modified ingredients for "${meal.name}".
Ingredients: ${ingList}
Write a new method (4–5 steps). Respond ONLY with a JSON array of step strings.
No explanation, no markdown, no code fences.`,
          }],
        }),
      });
      const d = await r.json();
      const t = d.content[0].text;
      const steps = JSON.parse(t.replace(/```json|```/g, "").trim());
      setMethod(steps);
      setHasEdits(false);
    } catch (e) {
      console.error("Regenerate failed", e);
    } finally {
      setRegenLoading(false);
    }
  };

  // ── Export ────────────────────────────────────────────────────────────────

  const exportIngredients = () => {
    const lines = ingredients.map(i => `${i.name}${i.amount ? " — " + i.amount : ""}`);
    const text  = `${meal.name} — Ingredients\n\n${lines.join("\n")}`;
    navigator.clipboard.writeText(text)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
      .catch(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  // ── Auth / save (unchanged from original) ─────────────────────────────────

  const handleSaveClick  = () => setShowAuth(true);

  const handleSendCode = async () => {
    if (!email.trim()) return;
    setEmailLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: true },
      });
      if (!error) setCodeSent(true);
    } catch {}
    finally { setEmailLoading(false); }
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) return;
    setVerifyLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code.trim(),
        type:  "email",
      });
      if (!error) { setSaved(true); setShowAuth(false); }
    } catch {}
    finally { setVerifyLoading(false); }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ paddingBottom: hasEdits ? 140 : 40 }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* Header */}
      <div style={{ background: C.primary, padding: `${SPACE.xl}px ${SPACE.s}px ${SPACE.m}px` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: SPACE.s }}>
          <button
            onClick={onBack}
            style={{ background: "none", border: "none", cursor: "pointer", color: C.textStrong, fontFamily: F, fontSize: 14, fontWeight: "700", padding: 0 }}
          >
            ← Back
          </button>
          <div style={{ display: "flex", gap: SPACE.xs }}>
            <Chip
              label={saved ? "Saved ✓" : "Save"}
              selected={saved}
              onClick={handleSaveClick}
            />
            <button
              onClick={exportIngredients}
              style={{
                display:     "flex",
                alignItems:  "center",
                gap:         SPACE.xxs,
                padding:     "7px 14px",
                borderRadius:"100px",
                cursor:      "pointer",
                border:      `1.5px solid ${copied ? "transparent" : C.textStrong}`,
                background:  copied ? C.background : "transparent",
                color:       C.textStrong,
                fontSize:    12,
                fontFamily:  F,
                fontWeight:  "600",
                transition:  "all 0.2s",
              }}
            >
              {copied ? "✓ Copied!" : "↑ Export"}
            </button>
          </div>
        </div>

        <div style={{ fontSize: 44, marginBottom: 14 }}>{meal.emoji}</div>
        <h1 style={{ ...T.h1, color: C.textStrong, margin: "0 0 10px" }}>{meal.name}</h1>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ background: C.background, borderRadius: 100, padding: "5px 14px", fontSize: 12, fontWeight: "700", color: C.textStrong, fontFamily: F }}>⏱ {meal.time}</span>
          <span style={{ background: C.background, borderRadius: 100, padding: "5px 14px", fontSize: 12, color: C.textStrong, fontFamily: F }}>{meal.difficulty}</span>
          <span style={{ background: C.background, borderRadius: 100, padding: "5px 14px", fontSize: 12, color: C.textStrong, fontFamily: F }}>🔥 {meal.calories} kcal</span>
        </div>

        {meal.macros && (
          <div style={{ marginTop: 14 }}>
            <MacroBar protein={meal.macros.protein} carbs={meal.macros.carbs} fat={meal.macros.fat} size="lg" calories={meal.calories} />
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: `${SPACE.m}px ${SPACE.s}px`, display: "flex", flexDirection: "column", gap: SPACE.m }}>

        {/* Ingredients */}
        <div>
          <h2 style={{ ...T.h3, color: C.textStrong, margin: `0 0 ${SPACE.xs}px` }}>Ingredients</h2>
          <IngredientTable
            ingredients={ingredients}
            onSwapOpen={(ing, index)   => setSwapTarget({ ingredient: ing, index })}
            onAmountOpen={(ing, index) => setAmountTarget({ ingredient: ing, index })}
            onRemove={handleRemove}
          />
        </div>

        {/* Method */}
        <div>
          <h2 style={{ ...T.h3, color: C.textStrong, margin: `0 0 ${SPACE.xs}px` }}>Method</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: SPACE.xs }}>
            {method.map((step, i) => (
              <div key={i} style={{
                background:   C.background,
                borderRadius: 12,
                padding:      `${SPACE.s}px`,
                boxShadow:    SHADOW.raised,
                display:      "flex",
                gap:          SPACE.xs,
              }}>
                <span style={{ ...T.tiny, fontWeight: "700", color: C.primary, minWidth: 20 }}>{i + 1}</span>
                <span style={{ ...T.tiny, color: C.textStrong, lineHeight: "1.5" }}>{step}</span>
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

      {/* Auth sheet (preserved from original) */}
      {showAuth && (
        <div
          onClick={() => setShowAuth(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "390px", background: C.background, borderRadius: "20px 20px 0 0", padding: "32px 24px 48px", display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: C.muted, fontFamily: F }}>Save recipe</span>
              <button onClick={() => setShowAuth(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.muted, padding: 0 }}>✕</button>
            </div>

            {!codeSent ? (
              <>
                <p style={{ fontFamily: F, fontSize: 14, color: C.textStrong, margin: 0 }}>Enter your email to save this recipe.</p>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ padding: "12px 16px", borderRadius: 100, border: `1.5px solid ${C.strokeStrong}`, fontFamily: F, fontSize: 14, color: C.textStrong, background: C.background, outline: "none" }}
                />
                <button
                  onClick={handleSendCode}
                  disabled={emailLoading}
                  style={{ padding: "14px", borderRadius: 100, border: "none", background: C.primary, color: C.textStrong, fontFamily: F, fontWeight: "700", fontSize: 15, cursor: "pointer" }}
                >
                  {emailLoading ? "Sending…" : "Send code"}
                </button>
              </>
            ) : (
              <>
                <p style={{ fontFamily: F, fontSize: 14, color: C.textStrong, margin: 0 }}>Enter the 6-digit code sent to {email}.</p>
                <input
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  maxLength={6}
                  style={{ padding: "12px 16px", borderRadius: 100, border: `1.5px solid ${C.strokeStrong}`, fontFamily: F, fontSize: 14, color: C.textStrong, background: C.background, outline: "none", letterSpacing: "0.3em", textAlign: "center" }}
                />
                <button
                  onClick={handleVerifyCode}
                  disabled={verifyLoading}
                  style={{ padding: "14px", borderRadius: 100, border: "none", background: C.primary, color: C.textStrong, fontFamily: F, fontWeight: "700", fontSize: 15, cursor: "pointer" }}
                >
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
