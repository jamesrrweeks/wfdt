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

  const handleSaveClick = () => setShowAuth(true);

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

      {/* Bottom sheet */}
      {showAuth && (
        <div
          onClick={()=>setShowAuth(false)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:100, display:"flex", alignItems:"flex-end", justifyContent:"center" }}
        >
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
        </div>
      )}

      <div style={{ background:C.strokeWeak, padding:`${SPACE.xxl}px ${SPACE.s}px ${SPACE.m}px`, borderBottom:`1px solid ${C.strokeStrong}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
          <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, fontSize:"14px", fontFamily:F }}>← Back</button>
          <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
            <Chip label={saved?"Saved ✓":"Save"} selected={saved} onClick={handleSaveClick}/>
            <button onClick={exportIngredients} style={{
              display:"flex", alignItems:"center", gap:`${SPACE.xs}px`, padding:"7px 14px", borderRadius:"100px", cursor:"pointer",
              border:`1.5px solid ${copied?"transparent":C.strokeStrong}`,
              background:copied?C.primary:"transparent",
              color:C.textStrong, fontSize:"12px", fontFamily:F, fontWeight:"600", transition:"all 0.2s",
            }}>{copied?"✓ Copied!":"↑ Export ingredients"}</button>
          </div>
        </div>
        <div style={{ fontSize:"44px", marginBottom:"14px" }}>{meal.emoji}</div>
        <h2 style={{ ...T.h2, color:C.textStrong, margin:"0 0 10px" }}>{meal.name}</h2>
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
          <span style={{ background:C.primary, borderRadius:"100px", padding:"5px 14px", fontSize:"12px", fontWeight:"700", color:C.textStrong, fontFamily:F }}>⏱ {meal.time}</span>
          <span style={{ background:C.background, border:`1px solid ${C.strokeStrong}`, borderRadius:"100px", padding:"5px 14px", fontSize:"12px", color:C.textStrong, fontFamily:F }}>{meal.difficulty}</span>
          <span style={{ background:C.background, border:`1px solid ${C.strokeStrong}`, borderRadius:"100px", padding:"5px 14px", fontSize:"12px", color:C.textStrong, fontFamily:F }}>🔥 {meal.calories} kcal</span>
        </div>
        {meal.macros && <div style={{ marginTop:"14px" }}><MacroBar protein={meal.macros.protein} carbs={meal.macros.carbs} fat={meal.macros.fat} size="lg" calories={meal.calories}/></div>}
      </div>

      <div style={{ padding:"28px 20px", display:"flex", flexDirection:"column", gap:`${SPACE.m}px` }}>
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:"14px" }}>
            <h3 style={{ ...T.h3, color:C.textStrong, margin:0 }}>Ingredients</h3>
            <span style={{ fontSize:"11px", color:C.muted, fontFamily:F, fontStyle:"italic" }}>swap or remove</span>
          </div>
          {ingredients.map((ing,i)=>(
            <div key={i}>
              {swapIdx===i ? (
                <div style={{ padding:"10px 0", borderBottom:i<ingredients.length-1?`1px solid ${C.strokeStrong}`:"none", display:"flex", gap:"8px", alignItems:"center" }}>
                  <input autoFocus value={swapVal} onChange={e=>setSwapVal(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")confirmSwap(i);if(e.key==="Escape")setSwapIdx(null);}}
                    style={{ flex:1, padding:"8px 14px", borderRadius:"100px", border:`1.5px solid ${C.textStrong}`, background:C.background, fontSize:"14px", fontFamily:F, color:C.textStrong }}/>
                  <button onClick={()=>confirmSwap(i)} style={{ width:30, height:30, borderRadius:"50%", background:C.textStrong, border:"none", color:C.primary, fontSize:"14px", cursor:"pointer" }}>✓</button>
                  <button onClick={()=>setSwapIdx(null)} style={{ width:30, height:30, borderRadius:"50%", background:"transparent", border:`1.5px solid ${C.strokeStrong}`, color:C.muted, fontSize:"12px", cursor:"pointer" }}>✕</button>
                </div>
              ):(
                <div style={{ padding:"13px 0", borderBottom:i<ingredients.length-1?`1px solid ${C.strokeStrong}`:"none", display:"flex", justifyContent:"space-between", alignItems:"center", gap:"10px" }}>
                  <span style={{ fontSize:"14px", color:C.textStrong, fontFamily:F, lineHeight:1.4, flex:1 }}>{ing}</span>
                  <div style={{ display:"flex", gap:"8px", flexShrink:0 }}>
                    <button onClick={()=>startSwap(i)} style={{ width:28, height:28, borderRadius:"50%", background:C.primary, border:"none", cursor:"pointer", fontSize:"13px", color:C.textStrong, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"700" }}>⇄</button>
                    <button onClick={()=>removeIng(i)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"14px", color:C.strokeStrong, padding:"0" }}>✕</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {hasEdits && (
          <button onClick={regenerateMethod} disabled={regenLoading} style={{ width:"100%", padding:"15px", borderRadius:"100px", border:"none", background:regenLoading?C.muted:C.primary, color:C.textStrong, fontSize:"14px", fontWeight:"700", fontFamily:F, cursor:regenLoading?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
            {regenLoading?<><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>✦</span>Updating method...</>:"✦ Regenerate method with new ingredients"}
          </button>
        )}

        <div>
          <h3 style={{ ...T.h3, color:C.textStrong, margin:"0 0 14px" }}>Method</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:`${SPACE.xs}px` }}>
            {method.map((step,i)=>(
              <div key={i} style={{ display:"flex", gap:`${SPACE.xs}px`, alignItems:"flex-start" }}>
                <div style={{ width:"26px", height:"26px", borderRadius:"50%", background:C.primary, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:"700", color:C.textStrong, fontFamily:F, flexShrink:0, marginTop:"1px" }}>{i+1}</div>
                <p style={{ margin:0, fontSize:"14px", lineHeight:"1.6", color:C.textStrong, fontFamily:F }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
