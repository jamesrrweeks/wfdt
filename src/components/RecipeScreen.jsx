import { useState } from "react";
import { C, SPACE, T, F } from "../tokens.js";
import MacroBar from "./MacroBar.jsx";
import Chip from "./Chip.jsx";
import { supabase } from "../supabase.js";

export default function RecipeScreen({ meal, onBack }) {
  const all = [...(meal.ingredients||[]),...(meal.pantryUsed||[])];
  const [ingredients, setIngredients] = useState(all);
  const [swapIdx, setSwapIdx]         = useState(null);
  const [swapVal, setSwapVal]         = useState("");
  const [method, setMethod]           = useState(meal.method);
  const [regenLoading, setRegenLoading] = useState(false);
  const [hasEdits, setHasEdits]       = useState(false);
  const [copied, setCopied]           = useState(false);
  const [saved, setSaved]             = useState(false);
const [showAuth, setShowAuth]       = useState(false);
const [email, setEmail]             = useState("");
const [codeSent, setCodeSent]       = useState(false);
const [code, setCode]               = useState("");
const [emailLoading, setEmailLoading] = useState(false);
const [verifyLoading, setVerifyLoading] = useState(false);

  const removeIng = (i) => { setIngredients(p=>p.filter((_,idx)=>idx!==i)); setHasEdits(true); if(swapIdx===i)setSwapIdx(null); };
  const startSwap = (i) => { setSwapVal(ingredients[i]); setSwapIdx(i); };
  const confirmSwap = (i) => {
    const v=swapVal.trim(); if(!v){setSwapIdx(null);return;}
    setIngredients(p=>p.map((ing,idx)=>idx===i?v:ing)); setSwapIdx(null); setSwapVal(""); setHasEdits(true);
  };
  const exportIngredients = () => {
    const text=`${meal.name} — Ingredients\n\n${ingredients.join("\n")}`;
    navigator.clipboard.writeText(text).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);}).catch(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);});
  };
  const regenerateMethod = async () => {
    setRegenLoading(true);
    try {
      const r = await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,messages:[{role:"user",content:`You are a cooking assistant. The user modified ingredients for "${meal.name}".\nIngredients: ${ingredients.join(", ")}\nWrite a new method (4-5 steps). Respond ONLY with a JSON array of steps e.g. ["Step one.","Step two."]\nNo explanation, no markdown.`}]})});
      const d=await r.json(); const t=d.content[0].text; const s=JSON.parse(t.replace(/```json|```/g,"").trim()); setMethod(s); setHasEdits(false);
    } catch{}
    finally{setRegenLoading(false);}
  };

  const handleSaveClick = () => {
    setShowAuth(true);
  };

const handleSendCode = async () => {
  if (!email.trim()) return;
  setEmailLoading(true);
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true }
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
      type: "email"
    });
    if (!error) {
      setSaved(true);
      setShowAuth(false);
    }
  } catch {}
  finally { setVerifyLoading(false); }
};

  return (
    <div style={{ paddingBottom:"40px" }}>

      {/* Bottom sheet overlay */}
      {showAuth && (
       <div
  onClick={e=>e.stopPropagation()}
  style={{ width:"100%", maxWidth:"390px", background:C.background, borderRadius:"20px 20px 0 0", padding:"32px 24px 48px", display:"flex", flexDirection:"column", gap:"16px" }}
>
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
    <span style={{ fontSize:"11px", fontWeight:"700", letterSpacing:"0.1em", textTransform:"uppercase", color:C.muted, fontFamily:F }}>Save recipe</span>
    <button onClick={()=>setShowAuth(false)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"18px", color:C.muted, padding:0 }}>✕</button>
  </div>

  {!codeSent ? (
    <>
      <div>
        <div style={{ ...T.h3, color:C.textStrong, marginBottom:"6px" }}>Save "{meal.name}"</div>
        <div style={{ fontSize:"14px", color:C.muted, fontFamily:F, lineHeight:1.5 }}>Enter your email and we'll send you a 6-digit code.</div>
      </div>
      <input
        type="email"
        placeholder="you@email.com"
        value={email}
        onChange={e=>setEmail(e.target.value)}
        onKeyDown={e=>{ if(e.key==="Enter") handleSendCode(); }}
        style={{ padding:"14px 18px", borderRadius:"100px", border:`1.5px solid ${C.strokeStrong}`, background:C.card, fontSize:"15px", fontFamily:F, color:C.textStrong, outline:"none" }}
      />
      <button
        onClick={handleSendCode}
        disabled={emailLoading || !email.trim()}
        style={{ width:"100%", padding:"16px", borderRadius:"100px", border:"none", background:emailLoading||!email.trim()?C.muted:C.primary, color:C.textStrong, fontSize:"15px", fontWeight:"700", fontFamily:F, cursor:emailLoading||!email.trim()?"not-allowed":"pointer" }}
      >
        {emailLoading ? "Sending..." : "Send code →"}
      </button>
    </>
  ) : (
    <>
      <div>
        <div style={{ ...T.h3, color:C.textStrong, marginBottom:"6px" }}>Check your email</div>
        <div style={{ fontSize:"14px", color:C.muted, fontFamily:F, lineHeight:1.5 }}>We sent a 6-digit code to <strong>{email}</strong></div>
      </div>
      <input
        type="text"
        inputMode="numeric"
        placeholder="000000"
        maxLength={6}
        value={code}
        onChange={e=>setCode(e.target.value.replace(/\D/g,""))}
        onKeyDown={e=>{ if(e.key==="Enter") handleVerifyCode(); }}
        style={{ padding:"14px 18px", borderRadius:"100px", border:`1.5px solid ${C.strokeStrong}`, background:C.card, fontSize:"24px", fontFamily:F, color:C.textStrong, outline:"none", textAlign:"center", letterSpacing:"0.3em" }}
      />
      <button
        onClick={handleVerifyCode}
        disabled={verifyLoading || code.length < 6}
        style={{ width:"100%", padding:"16px", borderRadius:"100px", border:"none", background:verifyLoading||code.length<6?C.muted:C.primary, color:C.textStrong, fontSize:"15px", fontWeight:"700", fontFamily:F, cursor:verifyLoading||code.length<6?"not-allowed":"pointer" }}
      >
        {verifyLoading ? "Verifying..." : "Confirm code →"}
      </button>
      <button onClick={()=>setCodeSent(false)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"13px", color:C.muted, fontFamily:F, textAlign:"center" }}>← Use a different email</button>
    </>
  )}
</div>
}
