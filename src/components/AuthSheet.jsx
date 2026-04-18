import { useState } from "react";
import { C, SPACE, T, F, FD } from "../tokens.js";
import { supabase } from "../supabase.js";
import ModalTemplate from "./ModalTemplate.jsx";

/**
 * AuthSheet
 *
 * Three-state OTP auth flow inside ModalTemplate.
 * Stages: "signin" → "otp" → "success"
 *
 * Props:
 *   reason       {string} — "save" | "myrecipes" | "profile"
 *   onSuccess    {fn}     — called after sign-in completes (save: recipe saved, others: navigate)
 *   onViewSaved  {fn}     — called when user taps "View saved recipes" (save only)
 *   onClose      {fn}     — called when backdrop tapped or primary success CTA tapped
 */

const COPY = {
  save: {
    signinH1:    "Sign in to save recipe",
    successH1:   "Your recipe has been saved",
    primaryCTA:  "Keep cooking",
    secondaryCTA: "View saved recipes",
  },
  myrecipes: {
    signinH1:    "Sign in to see your recipes",
    successH1:   "You're signed in",
    primaryCTA:  "View recipes",
    secondaryCTA: null,
  },
  profile: {
    signinH1:    "Sign in to your account",
    successH1:   "You're signed in",
    primaryCTA:  "View profile",
    secondaryCTA: null,
  },
};

const SUBTITLE = "Enter your email and we'll send you a 6-digit code";

export default function AuthSheet({ reason = "save", onSuccess, onViewSaved, onClose }) {
  const [stage, setStage]   = useState("signin");
  const [email, setEmail]   = useState("");
  const [code, setCode]     = useState("");
  const [loading, setLoading] = useState(false);
const [error, setError]       = useState("");
const [verifiedUser, setVerifiedUser] = useState(null);
  const copy = COPY[reason] || COPY.save;

  // ── Shared styles ──────────────────────────────────────────────
  const inputStyle = {
    width: "100%",
    height: `${SPACE.xl}px`,
    padding: `${SPACE.xs}px ${SPACE.m}px`,
    border: `1px solid ${C.strokeStrong}`,
    borderRadius: "32px",
    background: C.background,
    fontFamily: F,
    fontSize: "16px",
    lineHeight: "24px",
    color: C.textStrong,
    outline: "none",
    boxSizing: "border-box",
  };

  const ctaBase = {
    width: "100%",
    height: `${SPACE.xl}px`,
    padding: `${SPACE.xs}px ${SPACE.s}px`,
    border: "none",
    borderRadius: "32px",
    fontFamily: F,
    fontSize: "16px",
    lineHeight: "24px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    opacity: loading ? 0.6 : 1,
  };

  const ctaDark     = { ...ctaBase, background: C.textStrong, color: "#FFFFFF" };
  const ctaLime     = { ...ctaBase, background: C.primary, color: C.textStrong };
  const ctaOutlined = { ...ctaBase, background: "transparent", border: `1px solid ${C.strokeStrong}`, color: C.textStrong };

  const infoBlock = {
    display: "flex", flexDirection: "column",
    alignItems: "flex-start", gap: `${SPACE.s}px`, width: "100%",
  };

  const actionsBlock = {
    display: "flex", flexDirection: "column",
    gap: `${SPACE.s}px`, width: "100%",
  };

  // ── Handlers ───────────────────────────────────────────────────
  async function handleSendCode() {
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setStage("otp");
  }

  async function handleVerify() {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    const { data, error: err } = await supabase.auth.verifyOtp({
  email: email.trim(),
  token: code.trim(),
  type: "email",
});
setLoading(false);
if (err) { setError(err.message); return; }
setVerifiedUser(data.user);
setStage("success");
onSuccess?.(data.user);
  }

  // ── Render ─────────────────────────────────────────────────────
  return (
    <ModalTemplate onClose={onClose}>

      {/* ── Sign in ── */}
      {stage === "signin" && (
        <>
          <div style={infoBlock}>
            <h1 style={{ ...T.h1, color: C.textStrong, margin: 0, width: "100%" }}>
              {copy.signinH1}
            </h1>
            <p style={{ ...T.small, color: C.textWeak, margin: 0, width: "100%" }}>
              {SUBTITLE}
            </p>
          </div>
          <div style={actionsBlock}>
            {error && <p style={{ ...T.tiny, color: C.red, margin: 0 }}>{error}</p>}
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              style={inputStyle}
            />
            <button
              onClick={handleSendCode}
              disabled={loading || !email.includes("@")}
              style={ctaDark}
            >
              {loading ? "Sending…" : "Send code"}
            </button>
          </div>
        </>
      )}

      {/* ── OTP ── */}
      {stage === "otp" && (
        <>
          <div style={infoBlock}>
            <h1 style={{ ...T.h1, color: C.textStrong, margin: 0, width: "100%" }}>
              Check your email
            </h1>
            <p style={{ ...T.small, color: C.textWeak, margin: 0, width: "100%" }}>
              We sent a 6-digit code to {email}
            </p>
          </div>
          <div style={actionsBlock}>
            {error && <p style={{ ...T.tiny, color: C.red, margin: 0 }}>{error}</p>}
            <input
              type="text"
              inputMode="numeric"
              placeholder="123456"
              value={code}
              onChange={e => { setCode(e.target.value); setError(""); }}
              style={{ ...inputStyle, fontWeight: "700", letterSpacing: "0.2em", textAlign: "center" }}
            />
            <button
              onClick={handleVerify}
              disabled={loading || code.length < 4}
              style={ctaLime}
            >
              {loading ? "Verifying…" : "Verify"}
            </button>
          </div>
        </>
      )}

      {/* ── Success ── */}
      {stage === "success" && (
        <>
          <div style={infoBlock}>
            <h1 style={{ ...T.h1, color: C.textStrong, margin: 0, width: "100%" }}>
              {copy.successH1}
            </h1>
            <div style={{
              width: "80px", height: "80px", borderRadius: "80px",
              background: C.primary,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="38" height="28" viewBox="0 0 38 28" fill="none">
                <path d="M3 14L14 25L35 3" stroke={C.textStrong} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div style={actionsBlock}>
            {copy.secondaryCTA && (
<button onClick={() => onViewSaved(verifiedUser)} style={ctaOutlined}>
  {copy.secondaryCTA}
              </button>
            )}
            <button onClick={onClose} style={ctaDark}>
              {copy.primaryCTA}
            </button>
          </div>
        </>
      )}

    </ModalTemplate>
  );
}
