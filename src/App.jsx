import { useState } from "react";
import { C, F, SPACE, T } from "./tokens.js";
import { buildPrompt } from "./prompt.js";
import { MOCK_MEALS } from "./data.jsx";
import InputScreen   from "./components/InputScreen.jsx";
import ResultsScreen from "./components/ResultsScreen.jsx";
import RecipeScreen  from "./components/RecipeScreen.jsx";
import DesignSystem  from "./components/DesignSystem.jsx";
import BottomNav     from "./components/BottomNav.jsx";
import PageTemplate  from "./components/PageTemplate.jsx";
import { BookmarkIcon } from "./icons.jsx";

const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Gasoek+One&display=swap";
document.head.appendChild(link);

const params      = new URLSearchParams(window.location.search);
const devMode     = params.has("dev");
const resultsMode = params.has("results");

export default function App() {
  const [screen, setScreen]             = useState(devMode ? "recipe" : resultsMode ? "results" : "input");
  const [prefs, setPrefs]               = useState(resultsMode ? { proteins:["Chicken"], carbs:["Rice"], veg:["Broccoli"], calories:500, people:2, season:"Autumn" } : null);
  const [meals, setMeals]               = useState(resultsMode ? MOCK_MEALS : null);
  const [selectedMeal, setSelectedMeal] = useState(devMode ? MOCK_MEALS[0] : null);
  const [isLoading, setIsLoading]       = useState(false);
  const [apiError, setApiError]         = useState(null);
  const [recipeSaved, setRecipeSaved]   = useState(false);

  const handleGenerate = async (p) => {
    setPrefs(p);
    setApiError(null);
    setIsLoading(true);
    try {
      const r = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-secret-token": import.meta.env.VITE_API_SECRET_TOKEN,
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 4000,
          messages: [{ role: "user", content: buildPrompt(p) }],
        }),
      });
      const d = await r.json();
      const t = d.content[0].text;
      const c = t.replace(/```json|```/g, "").trim();
      setMeals(JSON.parse(c).map((m, i) => ({ ...m, id: i + 1 })));
    } catch {
      setApiError("Couldn't connect — showing example meals.");
      setMeals(MOCK_MEALS);
    } finally {
      setIsLoading(false);
      setScreen("results");
    }
  };

  const recipeChipLabels = selectedMeal ? [
    selectedMeal.cuisine  || null,
    selectedMeal.time     || null,
    selectedMeal.calories ? `${selectedMeal.calories} kcal` : null,
    prefs?.people         ? `${prefs.people} serves` : null,
  ].filter(Boolean) : [];

  const recipeChips = recipeChipLabels.map((label, i) => (
    <span key={i} style={{
      background: C.primaryMuted,
      borderRadius: 8,
      padding: "3px 16px",
      ...T.tiny,
      color: C.textStrong,
    }}>
      {label}
    </span>
  ));

  const showNav = screen !== "ds";

  return (
    <div style={{ background: C.strokeWeak, minHeight: "100vh", display: "flex", justifyContent: "center", fontFamily: F, overflowY: "scroll" }}>
      <div style={{ width: "390px", minHeight: "100vh", background: C.fill, fontFamily: F }}>

       {screen === "input" && (
  <PageTemplate title="What's for dinner tonight?">
    <InputScreen onGenerate={handleGenerate} isLoading={isLoading} onShowDS={() => setScreen("ds")} />
  </PageTemplate>
)}

        {screen === "ds" && (
          <DesignSystem onBack={() => setScreen("input")} />
        )}

        {screen === "results" && (
  <PageTemplate
    showBack
    onBack={() => setScreen("input")}
    title="Results"
  >
    {apiError && (
      <div style={{ background: "#FFF0ED", borderBottom: "1px solid #F5C2B8", padding: "10px 20px", fontSize: "12px", color: C.red, fontFamily: F }}>
        ⚠ {apiError}
      </div>
    )}
    <ResultsScreen
      prefs={prefs}
      meals={meals}
      isLoading={isLoading}
      onSelect={m => { setSelectedMeal(m); setRecipeSaved(false); setScreen("recipe"); }}
      onRemix={m => { setSelectedMeal(m); }}
      onRegenerate={updatedPrefs => handleGenerate(updatedPrefs)}
    />
  </PageTemplate>
)}

        {screen === "recipe" && selectedMeal && (
          <PageTemplate
            showBack
            onBack={() => setScreen("results")}
            title={selectedMeal.name}
            chips={recipeChips}
            actions={[
              {
                icon: <BookmarkIcon filled={recipeSaved} />,
                onPress: () => setRecipeSaved(prev => !prev),
              }
            ]}
          >
            <RecipeScreen
              meal={selectedMeal}
              prefs={prefs}
            />
          </PageTemplate>
        )}

        {showNav && (
          <BottomNav
            active={screen === "myrecipes" ? "myrecipes" : "home"}
            onHome={() => setScreen("input")}
            onMyRecipes={() => setScreen("myrecipes")}
            onProfile={() => {}}
          />
        )}

      </div>
    </div>
  );
}
