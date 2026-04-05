import { useState } from "react";
import { C, SPACE, T, F, SHADOW } from "../tokens.js";
import { ChickenIcon, VegeIcon, BeefIcon, SeafoodIcon, SearchIcon, PlusIcon, MinusIcon } from "../icons.jsx";
import Stepper from "./Stepper.jsx";
import MacroBar from "./MacroBar.jsx";
import Chip from "./Chip.jsx";

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
    const tokens = `## Design tokens
const C = { primary:"#CDEA45", red:"#BC4749", textStrong:"#3D331A", textWeak:"#7A7059", strokeStrong:"#A69A80", strokeWeak:"#F0ECE4", fill:"#FAF8F5", background:"#FFFFFF", pill:"#3D331A", pillText:"#FAF8F5" };
const SPACE = { nil:0, xxs:4, xs:8, s:16, m:24, l:32, xl:48, xxl:80 };
const F = "'Atkinson Hyperlegible', sans-serif";
const T = { h1:{fontSize:"40px",lineHeight:"48px",fontFamily:F,fontWeight:"700"}, h2:{fontSize:"32px",lineHeight:"40px",fontFamily:F,fontWeight:"700"}, h3:{fontSize:"20px",lineHeight:"28px",fontFamily:F,fontWeight:"700"}, small:{fontSize:"16px",lineHeight:"24px",fontFamily:F,fontWeight:"400"}, tiny:{fontSize:"14px",lineHeight:"20px",fontFamily:F,fontWeight:"400"} };
const SHADOW = { raised:"0px 2px 2px rgba(51,61,26,0.1)", overlay:"0px 8px 6px -2px rgba(61,51,26,0.15)" };`;

    const lines = [
      "I'm building a component for WFDT (What's For Dinner Tonight) — a mobile-first AI meal planning web app for NZ home cooks.",
      "React JSX with inline styles. Font: Atkinson Hyperlegible.",
      "",
      "## Project context",
      summary || "[Optional: paste SUMMARY.md]",
      "",
      tokens,
      "",
      "## Task",
      task || "[Describe what you're building. Paste Figma CSS exports here.]",
      "",
      "## Output",
      "Return only the component as a self-contained React function with proper imports.",
      "Use the tokens above exactly — no new hardcoded values.",
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
      navigator.clipboard.writeText(prompt).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2500); }).catch(doFallback);
    } else { doFallback(); }
  };

  return (
    <div>
      <DSField label="Project context (optional)" url={`${GITHUB_BASE}/docs/SUMMARY.md`} value={summary} onChange={setSummary} placeholder="Open SUMMARY.md ↗ and paste here..." rows={3}/>
      <DSField label="Your task" url={null} value={task} onChange={setTask} placeholder="Describe what you're building. Paste Figma CSS exports here..." rows={5}/>
      <div style={{ marginBottom:`${SPACE.m}px`, padding:`${SPACE.s}px`, borderRadius:"12px", border:`1px solid ${C.strokeStrong}`, background:C.fill, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ ...T.tiny, color:C.textWeak, fontStyle:"italic" }}>Need to modify existing logic? Also paste App.jsx.</span>
        <a href={`${GITHUB_BASE}/src/App.jsx`} target="_blank" rel="noreferrer" style={{ ...T.tiny, color:C.textStrong, fontWeight:"700", textDecoration:"underline", marginLeft:`${SPACE.xs}px` }}>Open ↗</a>
      </div>
      <button onClick={handleCopy} style={{ width:"100%", padding:`${SPACE.s}px`, borderRadius:"32px", border:"none", background:copied?C.strokeStrong:C.primary, color:C.textStrong, ...T.small, fontWeight:"700", cursor:"pointer", transition:"background 0.2s" }}>
        {copied ? "✓ Prompt copied — paste into Claude" : "Copy prompt"}
      </button>
    </div>
  );
}

function TaxonomyAccordion() {
  const [open, setOpen] = useState({});
  const toggle = (key) => setOpen(o=>({...o,[key]:!o[key]}));
  const TAXONOMY = [
    { section:"Protein", categories:[
      { name:"Chicken", items:["Chicken breast","Chicken thighs","Chicken mince","Chicken drumsticks","Chicken wings","Turkey mince","Turkey breast","Duck"] },
      { name:"Vegetarian", items:["Eggs","Tofu","Firm tofu","Tempeh","Chickpeas","Lentils","Red lentils","Kidney beans","Halloumi","Paneer"] },
      { name:"Beef & Lamb", items:["Beef mince","Beef steak","Beef strips","Lamb chops","Lamb mince","Lamb shoulder","Sausages","Bacon","Chorizo"] },
      { name:"Seafood", items:["Salmon","Salmon fillet","White fish","Snapper","Tarakihi","Prawns","Tuna (canned)","Mussels","Scallops"] },
    ]},
    { section:"Carbs", categories:[
      { name:"Pasta & Noodles", items:["Pasta","Spaghetti","Penne","Fettuccine","Udon noodles","Soba noodles","Rice noodles","Couscous"] },
      { name:"Rice & Grains", items:["Rice","Basmati rice","Jasmine rice","Brown rice","Quinoa","Bulgur wheat","Pearl barley"] },
      { name:"Bread & Wraps", items:["Sourdough","Flatbread","Tortillas","Pita","Naan","Bao buns"] },
      { name:"Potato & Root", items:["Potatoes","Kumara","Sweet potato","Baby potatoes","Parsnip"] },
    ]},
    { section:"Vegetables", categories:[
      { name:"All year", items:["Onion","Garlic","Capsicum","Spinach","Broccoli","Mushrooms","Carrot","Tomatoes","Avocado"] },
      { name:"Summer", items:["Courgette","Cherry tomatoes","Corn","Cucumber","Eggplant","Beans","Lettuce","Rocket","Basil"] },
      { name:"Autumn", items:["Pumpkin","Kumara","Beetroot","Broccolini","Cauliflower","Kale","Leek","Mushrooms","Parsnip"] },
      { name:"Winter", items:["Kumara","Parsnip","Cauliflower","Kale","Brussels sprouts","Leek","Silverbeet","Celeriac"] },
      { name:"Spring", items:["Asparagus","Peas","Snap peas","Broad beans","Radish","Courgette","Broccolini","Fennel"] },
    ]},
  ];
  const cell = { padding:`${SPACE.xs}px ${SPACE.s}px`, ...T.tiny, color:C.textStrong, borderBottom:`1px solid ${C.strokeWeak}`, verticalAlign:"top" };
  const hCell = { ...cell, fontWeight:"700", color:C.textWeak, background:C.fill, textTransform:"uppercase", letterSpacing:"0.08em" };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:`${SPACE.xs}px` }}>
      {TAXONOMY.map(({section,categories})=>{
        const isOpen = open[section];
        return (
          <div key={section} style={{ border:`1px solid ${C.strokeStrong}`, borderRadius:"12px", overflow:"hidden" }}>
            <button onClick={()=>toggle(section)} style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:`${SPACE.s}px`, background:C.fill, border:"none", cursor:"pointer" }}>
              <span style={{ ...T.small, fontWeight:"700", color:C.textStrong }}>{section}</span>
              <span style={{ ...T.tiny, color:C.muted, display:"inline-block", transform:isOpen?"rotate(180deg)":"rotate(0deg)", transition:"transform 0.2s" }}>▼</span>
            </button>
            {isOpen && (
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", background:C.background }}>
                  <thead><tr><th style={{ ...hCell, width:"30%" }}>Category</th><th style={hCell}>Items</th></tr></thead>
                  <tbody>
                    {categories.map(({name,items})=>(
                      <tr key={name}><td style={{ ...cell, fontWeight:"700", whiteSpace:"nowrap" }}>{name}</td><td style={cell}>{items.join(", ")}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function DesignSystemScreen({ onBack }) {
  const [stepVal, setStepVal]   = useState(2);
  const [showModal, setShowModal] = useState(false);

  const Section = ({ title, children }) => (
    <div style={{ marginBottom:`${SPACE.xl}px` }}>
      <div style={{ ...T.h3, color:C.dark, borderBottom:`1px solid ${C.strokeStrong}`, paddingBottom:`${SPACE.xs}px`, marginBottom:`${SPACE.m}px` }}>{title}</div>
      {children}
    </div>
  );

  return (
    <div style={{ padding:`${SPACE.xxl}px ${SPACE.s}px ${SPACE.xl}px`, background:C.bg, minHeight:"100vh", position:"relative" }}>

      {/* Modal */}
      {showModal && (
        <div style={{ position:"fixed", inset:0, zIndex:100, background:"rgba(61,51,26,0.4)", display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={()=>setShowModal(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"390px", maxHeight:"90vh", overflowY:"auto", background:C.bg, borderRadius:"24px 24px 0 0", padding:`${SPACE.m}px ${SPACE.s}px ${SPACE.xxl}px`, boxShadow:SHADOW.overlay }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:`${SPACE.m}px` }}>
              <div style={{ ...T.h3, color:C.textStrong }}>Add component</div>
              <button onClick={()=>setShowModal(false)} style={{ background:"none", border:"none", cursor:"pointer", ...T.small, color:C.muted }}>✕</button>
            </div>
            {[
              { n:"1", title:"Build it", body:"Fill in your task below and copy the prompt. Paste into a new Claude chat." },
              { n:"2", title:"Copy the component", body:"In the sub-chat, copy the returned component code." },
              { n:"3", title:"Integrate here", body:"Come back to this master chat. Paste the component code and say 'integrate this into App.jsx'." },
              { n:"4", title:"Copy to GitHub", body:"Copy the updated file to GitHub via VS Code / GitHub Desktop and commit." },
              { n:"5", title:"Deploy", body:"Vercel auto-deploys within 60 seconds." },
            ].map(({n,title,body})=>(
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
      <div style={{ ...T.h2, color:C.dark, marginBottom:"4px" }}>Design System</div>
      <div style={{ ...T.small, color:C.muted, marginBottom:`${SPACE.m}px` }}>WFDT · Live token reference</div>

      <button onClick={()=>setShowModal(true)} style={{ width:"100%", padding:`${SPACE.s}px`, borderRadius:"32px", border:"none", background:C.primary, color:C.textStrong, ...T.small, fontWeight:"700", cursor:"pointer", marginBottom:`${SPACE.xl}px` }}>
        + Add component
      </button>

      <Section title="Colour tokens">
        {[
          ["primary",      C.primary,      "Lime — brand, selected, CTA"],
          ["red",          C.red,          "Error, destructive"],
          ["textStrong",   C.textStrong,   "Primary text, icons, interactions"],
          ["textWeak",     C.textWeak,     "Secondary text"],
          ["strokeStrong", C.strokeStrong, "Borders, dividers"],
          ["strokeWeak",   C.strokeWeak,   "Page background"],
          ["fill",         C.fill,         "Input fields, stepper buttons"],
          ["background",   C.background,   "Cards, chip backgrounds"],
          ["pill",         C.pill,         "Selected pill bg"],
        ].map(([name,hex,desc])=>(
          <div key={name} style={{ display:"flex", alignItems:"center", gap:`${SPACE.s}px`, marginBottom:`${SPACE.xs}px` }}>
            <div style={{ width:40, height:40, borderRadius:"8px", background:hex, border:`1px solid ${C.strokeStrong}`, flexShrink:0 }}/>
            <div>
              <div style={{ ...T.tiny, fontWeight:"700", color:C.dark }}>{name}</div>
              <div style={{ ...T.tiny, color:C.muted }}>{hex} · {desc}</div>
            </div>
          </div>
        ))}
      </Section>

      <Section title="Spacing tokens">
        {Object.entries(SPACE).map(([name,val])=>(
          <div key={name} style={{ display:"flex", alignItems:"center", gap:`${SPACE.s}px`, marginBottom:`${SPACE.xs}px` }}>
            <div style={{ width:`${Math.max(val,2)}px`, height:"8px", background:C.primary, borderRadius:"2px", flexShrink:0 }}/>
            <span style={{ ...T.tiny, color:C.dark }}>{name.toUpperCase()} · {val}px</span>
          </div>
        ))}
      </Section>

      <Section title="Typography">
        {[["H1",T.h1,"What's for dinner tonight?"],["H2",T.h2,"Here's what you can make"],["H3",T.h3,"Ingredients"],["Small",T.small,"Chicken breast · Broccoli"],["Tiny",T.tiny,"Swap or remove"]].map(([name,style,sample])=>(
          <div key={name} style={{ marginBottom:`${SPACE.s}px`, paddingBottom:`${SPACE.s}px`, borderBottom:`1px solid ${C.strokeWeak}` }}>
            <div style={{ ...T.tiny, color:C.muted, marginBottom:"4px" }}>{name} · {style.fontSize}/{style.lineHeight}</div>
            <div style={{ ...style, color:C.dark }}>{sample}</div>
          </div>
        ))}
      </Section>

      <Section title="Elevation">
        <div style={{ display:"flex", gap:`${SPACE.m}px` }}>
          {[["Raised",SHADOW.raised],["Overlay",SHADOW.overlay]].map(([name,shadow])=>(
            <div key={name} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:`${SPACE.xs}px` }}>
              <div style={{ width:80, height:48, background:C.background, borderRadius:"8px", boxShadow:shadow }}/>
              <span style={{ ...T.tiny, color:C.muted }}>{name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Icon set">
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
          ].map(([name,el])=>(
            <div key={name} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:`${SPACE.xxs}px` }}>
              <div style={{ width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", background:C.fill, borderRadius:"8px", border:`1px solid ${C.strokeStrong}` }}>{el}</div>
              <span style={{ ...T.tiny, color:C.muted, textAlign:"center", maxWidth:"60px" }}>{name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Chip — unselected / selected">
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
          <MacroBar protein={35} carbs={40} fat={25} calories={500}/>
          <MacroBar protein={35} carbs={40} fat={25}/>
        </div>
      </Section>

      <Section title="Food taxonomy">
        <TaxonomyAccordion/>
      </Section>
    </div>
  );
}