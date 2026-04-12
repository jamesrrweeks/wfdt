import { useState } from "react";
import { C, SPACE, T, F, FD, SHADOW } from "../tokens.js";
import { MACRO_PRESETS } from "../data.jsx";
import { ChickenIcon, VegeIcon, BeefIcon, SeafoodIcon, SearchIcon, PlusIcon, MinusIcon } from "../icons.jsx";
import CategoryTab from "./CategoryTab.jsx";
import Chip from "./Chip.jsx";
import Stepper from "./Stepper.jsx";
import MacroBar from "./MacroBar.jsx";

const GITHUB_BASE = "https://github.com/jamesrrweeks/wfdt/blob/main";

function DSField({ label, url, value, onChange, placeholder, rows=3 }) {
  return (
    <div style={{ marginBottom:`${SPACE.m}px` }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:`${SPACE.xs}px` }}>
        <span style={{ ...T.tiny, fontWeight:"700", color:C.textWeak, textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</span>
        {url && <a href={url} target="_blank" rel="noreferrer" style={{ ...T.tiny, color:C.textStrong, fontWeight:"700", textDecoration:"underline" }}>Open ↗</a>}
      </div>
      <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
        style={{ width:"100%", padding:`${SPACE.s}px`, borderRadius:"12px", border:`1px solid ${C.strokeStrong}`, background:C.background, ...T.tiny, color:C.textStrong, resize:"vertical", outline:"none", lineHeight:1.6, fontFamily:F }}
      />
    </div>
  );
}

function SubChatTemplate() {
  const [summary, setSummary] = useState("");
  const [task, setTask]       = useState("");
  const [copied, setCopied]   = useState(false);

  const handleCopy = () => {
    const tokens = `## Design tokens\n\`\`\`javascript\nconst C = {\n  primary:"#CDEA45", red:"#BC4749", textStrong:"#3D331A",\n  textWeak:"#7A7059", strokeStrong:"#A69A80", strokeWeak:"#F0ECE4",\n  fill:"#FAF8F5", background:"#FFFFFF", pill:"#3D331A", pillText:"#FAF8F5",\n};\nconst SPACE = { nil:0, xxs:4, xs:8, s:16, m:24, l:32, xl:48, xxl:80 };\nconst F  = "'Atkinson Hyperlegible', sans-serif";\nconst FD = "'Gasoek One', sans-serif"; // H1 only\nconst T = {\n  h1:    { fontSize:"40px", lineHeight:"48px", fontFamily:FD, fontWeight:"400" },\n  h2:    { fontSize:"32px", lineHeight:"40px", fontFamily:F,  fontWeight:"700" },\n  h3:    { fontSize:"20px", lineHeight:"28px", fontFamily:F,  fontWeight:"700" },\n  small: { fontSize:"16px", lineHeight:"24px", fontFamily:F,  fontWeight:"400" },\n  tiny:  { fontSize:"14px", lineHeight:"20px", fontFamily:F,  fontWeight:"400" },\n};\nconst SHADOW = {\n  raised:  "0px 2px 2px rgba(51,61,26,0.1)",\n  overlay: "0px 8px 6px -2px rgba(61,51,26,0.15)",\n};\n\`\`\``;

    const lines = [
      "I'm building a component for WFDT (What's For Dinner Tonight) — a mobile-first AI meal planning web app for NZ home cooks.",
      "React JSX with inline styles. Fonts: Atkinson Hyperlegible (body) + Gasoek One (H1 only) via Google Fonts.",
      "",
      "## Project context",
      summary || "[Optional: paste SUMMARY.md contents]",
      "",
      tokens,
      "",
      "## Task",
      task || "[Describe what you're building. Paste Figma CSS exports here.]",
      "",
      "## Output",
      "Return only the component code as a self-contained React function.",
      "Use the design tokens above exactly. No hardcoded colour or spacing values.",
    ];

    const prompt = lines.join("\n");
    const doFallback = () => {
      const el = document.createElement("textarea");
      el.value = prompt; el.style.position="fixed"; el.style.opacity="0";
      document.body.appendChild(el); el.focus(); el.select();
      document.execCommand("copy"); document.body.removeChild(el);
      setCopied(true); setTimeout(()=>setCopied(false), 2500);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(prompt).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);}).catch(doFallback);
    } else { doFallback(); }
  };

  return (
    <div>
      <div style={{ ...T.tiny, color:C.textWeak, marginBottom:`${SPACE.m}px`, lineHeight:1.6 }}>
        Design tokens are embedded automatically. Just describe your task.
      </div>
      <DSField label="Project context (optional)" url={`${GITHUB_BASE}/docs/SUMMARY.md`} value={summary} onChange={setSummary} placeholder="Paste SUMMARY.md here for broader context..." rows={3}/>
      <DSField label="Your task" url={null} value={task} onChange={setTask} placeholder="Describe what you're building. Paste Figma CSS exports here..." rows={5}/>
      <button onClick={handleCopy} style={{
        width:"100%", padding:`${SPACE.s}px`, borderRadius:"32px", border:"none",
        background: copied ? C.strokeStrong : C.primary,
        color:C.textStrong, ...T.small, fontWeight:"700", cursor:"pointer", transition:"background 0.2s",
      }}>
        {copied ? "✓ Prompt copied — paste into Claude" : "Copy prompt"}
      </button>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom:`${SPACE.xl}px` }}>
      <div style={{ ...T.h3, color:C.textStrong, borderBottom:`1px solid ${C.strokeStrong}`, paddingBottom:`${SPACE.xs}px`, marginBottom:`${SPACE.m}px` }}>{title}</div>
      {children}
    </div>
  );
}

export default function DesignSystem({ onBack }) {
  const [stepVal, setStepVal]   = useState(2);
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ padding:`${SPACE.xxl}px ${SPACE.s}px ${SPACE.xl}px`, background:C.strokeWeak, minHeight:"100vh" }}>

      {showModal && (
        <div style={{ position:"fixed", inset:0, zIndex:100, background:"rgba(61,51,26,0.4)", display:"flex", alignItems:"flex-end", justifyContent:"center" }}
          onClick={()=>setShowModal(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"390px", maxHeight:"90vh", overflowY:"auto", background:C.strokeWeak, borderRadius:"24px 24px 0 0", padding:`${SPACE.m}px ${SPACE.s}px ${SPACE.xxl}px`, boxShadow:SHADOW.overlay }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:`${SPACE.m}px` }}>
              <div style={{ ...T.h3, color:C.textStrong }}>Add component</div>
              <button onClick={()=>setShowModal(false)} style={{ background:"none", border:"none", cursor:"pointer", ...T.small, color:C.muted }}>✕</button>
            </div>
            {[
              { n:"1", title:"Build it", body:"Fill in your task below and copy the prompt. Paste into a new Claude chat." },
              { n:"2", title:"Copy the component", body:"In the sub-chat, copy the returned component code." },
              { n:"3", title:"Integrate here", body:"Come back to this master chat. Paste the component code and say 'integrate this'." },
              { n:"4", title:"Copy to GitHub", body:"Copy the updated file. Open it in GitHub, select all, paste, commit." },
              { n:"5", title:"Deploy", body:"Vercel auto-deploys within 60 seconds. Done." },
            ].map(({ n, title, body }) => (
              <div key={n} style={{ display:"flex", gap:`${SPACE.s}px`, marginBottom:`${SPACE.s}px` }}>
                <div style={{ width:24, height:24, borderRadius:"50%", background:C.primary, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:"2px" }}>
                  <span style={{ ...T.tiny, fontWeight:"700", color:C.textStrong }}>{n}</span>
                </div>
                <div>
                  <div style={{ ...T.tiny, fontWeight:"700", color:C.textStrong, marginBottom:"2px" }}>{title}</div>
                  <div style={{ ...T.tiny, color:C.textWeak, lineHeight:1.5 }}>{body}</div>
                </div>
              </div>
            ))}
            <div style={{ borderTop:`1px solid ${C.strokeStrong}`, margin:`${SPACE.m}px 0` }}/>
            <SubChatTemplate/>
          </div>
        </div>
      )}

      <div style={{ display:"flex", alignItems:"center", gap:`${SPACE.xs}px`, marginBottom:`${SPACE.m}px` }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", ...T.tiny, color:C.muted }}>← Back</button>
      </div>
      <div style={{ ...T.h2, color:C.textStrong, marginBottom:"4px" }}>Design System</div>
      <div style={{ ...T.small, color:C.muted, marginBottom:`${SPACE.m}px` }}>WFDT · Live token reference</div>

      <button onClick={()=>setShowModal(true)} style={{ width:"100%", padding:`${SPACE.s}px`, borderRadius:"32px", border:"none", background:C.primary, color:C.textStrong, ...T.small, fontWeight:"700", cursor:"pointer", marginBottom:`${SPACE.xl}px`, display:"flex", alignItems:"center", justifyContent:"center", gap:`${SPACE.xs}px` }}>
        + Add component
      </button>

      <Section title="Colour tokens">
        {[
          ["primary", C.primary, "Lime — brand, selected, CTA"],
          ["red", C.red, "Error, destructive"],
          ["textStrong", C.textStrong, "Primary text, icons"],
          ["textWeak", C.textWeak, "Secondary text"],
          ["strokeStrong", C.strokeStrong, "Borders, dividers"],
          ["strokeWeak", C.strokeWeak, "Page background"],
          ["fill", C.fill, "Input fields, stepper"],
          ["background", C.background, "Cards, chip bg"],
          ["pill", C.pill, "Selected pill bg"],
        ].map(([name, hex, desc]) => (
          <div key={name} style={{ display:"flex", alignItems:"center", gap:`${SPACE.s}px`, marginBottom:`${SPACE.xs}px` }}>
            <div style={{ width:40, height:40, borderRadius:"8px", background:hex, border:`1px solid ${C.strokeStrong}`, flexShrink:0 }}/>
            <div>
              <div style={{ ...T.tiny, fontWeight:"700", color:C.textStrong }}>{name}</div>
              <div style={{ ...T.tiny, color:C.muted }}>{hex} · {desc}</div>
            </div>
          </div>
        ))}
      </Section>

      <Section title="Typography">
        {[
          ["H1 — Gasoek One", T.h1, "What's for dinner tonight?"],
          ["H2", T.h2, "Here's what you can make"],
          ["H3", T.h3, "Ingredients"],
          ["Small", T.small, "Chicken breast · Broccoli · Rice"],
          ["Tiny", T.tiny, "Swap or remove"],
        ].map(([name, style, sample]) => (
          <div key={name} style={{ marginBottom:`${SPACE.s}px`, paddingBottom:`${SPACE.s}px`, borderBottom:`1px solid ${C.strokeWeak}` }}>
            <div style={{ ...T.tiny, color:C.muted, marginBottom:"4px" }}>{name} · {style.fontSize}/{style.lineHeight}</div>
            <div style={{ ...style, color:C.textStrong }}>{sample}</div>
          </div>
        ))}
      </Section>

      <Section title="Elevation">
        <div style={{ display:"flex", gap:`${SPACE.m}px` }}>
          {[["Raised", SHADOW.raised], ["Overlay", SHADOW.overlay]].map(([name, shadow]) => (
            <div key={name} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:`${SPACE.xs}px` }}>
              <div style={{ width:80, height:48, background:C.background, borderRadius:"8px", boxShadow:shadow }}/>
              <span style={{ ...T.tiny, color:C.muted }}>{name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Icons">
        <div style={{ display:"flex", flexWrap:"wrap", gap:`${SPACE.m}px` }}>
          {[
            ["Chicken active",   <ChickenIcon active={true}/>],
            ["Chicken inactive", <ChickenIcon active={false}/>],
            ["Vege active",      <VegeIcon active={true}/>],
            ["Vege inactive",    <VegeIcon active={false}/>],
            ["Beef active",      <BeefIcon active={true}/>],
            ["Beef inactive",    <BeefIcon active={false}/>],
            ["Seafood active",   <SeafoodIcon active={true}/>],
            ["Seafood inactive", <SeafoodIcon active={false}/>],
            ["Search",           <SearchIcon/>],
            ["Plus",             <PlusIcon/>],
            ["Minus",            <MinusIcon/>],
          ].map(([name, el]) => (
            <div key={name} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:`${SPACE.xxs}px` }}>
              <div style={{ width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", background:C.fill, borderRadius:"8px", border:`1px solid ${C.strokeStrong}` }}>{el}</div>
              <span style={{ ...T.tiny, color:C.muted, textAlign:"center", maxWidth:"60px" }}>{name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Category tab">
        <div style={{ display:"flex", gap:`${SPACE.xs}px` }}>
          <CategoryTab label="Chicken" icon={(active)=><ChickenIcon active={active}/>} active={true} onClick={()=>{}}/>
          <CategoryTab label="Vegetarian" icon={(active)=><VegeIcon active={active}/>} active={false} onClick={()=>{}}/>
        </div>
      </Section>

      <Section title="Chip">
        <div style={{ display:"flex", gap:`${SPACE.xs}px`, flexWrap:"wrap" }}>
          <Chip label="Chicken breast" selected={false} onClick={()=>{}}/>
          <Chip label="Chicken breast" selected={true} onClick={()=>{}}/>
        </div>
      </Section>

      <Section title="Stepper">
        <Stepper value={stepVal} onChange={setStepVal}/>
      </Section>

      <Section title="Macro bar">
        <div style={{ display:"flex", flexDirection:"column", gap:`${SPACE.s}px` }}>
          <MacroBar protein={35} carbs={40} fat={25} calories={500} size="lg"/>
          <MacroBar protein={35} carbs={40} fat={25}/>
        </div>
      </Section>

      <Section title="Pills">
        <div style={{ display:"flex", gap:`${SPACE.xs}px`, flexWrap:"wrap" }}>
          {["Chicken breast","Kumara","Broccoli"].map(item => (
            <div key={item} style={{ padding:"5px 11px", borderRadius:"100px", background:C.pill, color:C.pillText, ...T.tiny, fontWeight:"700", display:"flex", alignItems:"center", gap:"5px" }}>
              {item} <span style={{ opacity:0.5 }}>✕</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Buttons">
        <div style={{ display:"flex", flexDirection:"column", gap:`${SPACE.xs}px` }}>
          <button style={{ width:"100%", padding:"18px", borderRadius:"32px", border:"none", background:C.primary, color:C.textStrong, ...T.small, fontWeight:"700", cursor:"pointer" }}>✦ Generate meal</button>
          <button style={{ width:"100%", padding:"16px", borderRadius:"32px", border:`1px solid ${C.strokeStrong}`, background:"transparent", color:C.textStrong, ...T.small, fontWeight:"700", cursor:"pointer" }}>↻ Regenerate ideas</button>
          <button style={{ width:"100%", padding:"16px", borderRadius:"32px", border:"none", background:C.textStrong, color:C.background, ...T.small, fontWeight:"700", cursor:"pointer" }}>↻ Regenerate as Italian</button>
        </div>
      </Section>
    </div>
  );
}
