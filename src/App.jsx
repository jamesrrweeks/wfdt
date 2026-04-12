import { useState } from "react";
import { C, F, FD } from "./tokens.js";
import { buildPrompt } from "./prompt.js";
import { MOCK_MEALS } from "./data.jsx";
import InputScreen from "./components/InputScreen.jsx";
import ResultsScreen from "./components/ResultsScreen.jsx";
import RecipeScreen from "./components/RecipeScreen.jsx";
import DesignSystem from "./components/DesignSystem.jsx";

// Inject fonts once
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Gasoek+One&display=swap";
document.head.appendChild(link);

export default function App() {
  const [screen, setScreen]             = useState("input");
  const [prefs, setPrefs]               = useState(null);
  const [meals, setMeals]               = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isLoading, setIsLoading]       = useState(false);
  const [apiError, setApiError]         = useState(null);

  const handleGenerate = async (p) => {
    setPrefs(p); setApiError(null); setIsLoading(true);
    try {
      const r = await fetch("/api/generate", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1500,
          messages:[{ role:"user", content:buildPrompt(p) }]
        })
      });
      const d = await r.json();
      const t = d.content[0].text;
      const c = t.replace(/```json|```/g,"").trim();
      setMeals(JSON.parse(c).map((m,i)=>({...m, id:i+1})));
    } catch {
      setApiError("Couldn't connect — showing example meals.");
      setMeals(MOCK_MEALS);
    } finally {
      setIsLoading(false);
      setScreen("results");
    }
  };

  return (
    <div style={{ background:C.strokeWeak, minHeight:"100vh", display:"flex", justifyContent:"center", fontFamily:F }}>
      <div style={{ width:"390px", minHeight:"100vh", background:C.strokeWeak, fontFamily:F }}>
        {screen==="input" && (
          <InputScreen
            onGenerate={handleGenerate}
            isLoading={isLoading}
            onShowDS={()=>setScreen("ds")}
          />
        )}
        {screen==="ds" && (
          <DesignSystem onBack={()=>setScreen("input")}/>
        )}
        {screen==="results" && (
          <>
            {apiError && (
              <div style={{ background:"#FFF0ED", borderBottom:"1px solid #F5C2B8", padding:"10px 20px", fontSize:"12px", color:C.red, fontFamily:F }}>
                ⚠ {apiError}
              </div>
            )}
            <ResultsScreen
              prefs={prefs}
              meals={meals}
              isLoading={isLoading}
              onSelect={m=>{ setSelectedMeal(m); setScreen("recipe"); }}
              onBack={()=>setScreen("input")}
              onRegenerate={cuisine=>handleGenerate({...prefs, cuisine})}
            />
          </>
        )}
        {screen==="recipe" && (
          <RecipeScreen meal={selectedMeal} onBack={()=>setScreen("results")}/>
        )}
      </div>
    </div>
  );
}
