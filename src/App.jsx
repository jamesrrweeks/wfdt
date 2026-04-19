import { useState, useEffect } from "react"; 
import { supabase } from "./supabase.js";
import AuthSheet from "./components/AuthSheet.jsx";
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
import LoadingScreen  from "./components/LoadingScreen.jsx";
import MyRecipesScreen from "./components/MyRecipesScreen.jsx";
import Toast from "./components/Toast.jsx";
import AddRecipeModal from "./components/AddRecipeModal.jsx";

const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Gasoek+One&display=swap";
document.head.appendChild(link);

const iconsLink = document.createElement("link");
iconsLink.rel = "stylesheet";
iconsLink.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,100..700,0..1,0";
document.head.appendChild(iconsLink);

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
  const [previousScreen, setPreviousScreen] = useState("results");
  const [user, setUser]             = useState(null);
const [showAuth, setShowAuth]     = useState(false);
const [authReason, setAuthReason] = useState("save");
  const [savedMealNames, setSavedMealNames] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null);
  });
const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });
  return () => subscription.unsubscribe();
}, []);

  function showToast(type) {
  setToast({ type });
}

async function handleUndoToast() {
  const wasRemoved = toast?.type === "removed";
  setToast(null);
  if (wasRemoved) {
    setRecipeSaved(true);
    await supabase.from("recipes").insert({
      user_id:   user.id,
      name:      selectedMeal.name,
      icon:      selectedMeal.icon,
      cuisine:   selectedMeal.cuisine,
      time:      selectedMeal.time,
      calories:  selectedMeal.calories,
      servings:  prefs?.people ?? null,
      meal_data: selectedMeal,
    });
  } else {
    setRecipeSaved(false);
    await supabase.from("recipes").delete().match({ user_id: user.id, name: selectedMeal.name });
  }
}

  async function checkSavedMeals(newMeals, activeUser) {
  if (!activeUser?.id || !newMeals?.length) return;
  const names = newMeals.map(m => m.name);
  const { data, error } = await supabase
    .from("recipes")
    .select("name")
    .eq("user_id", activeUser.id)
    .in("name", names);
  if (error || !data) return;
  setSavedMealNames(new Set(data.map(r => r.name)));
}

async function handleBookmarkPress(freshUser) {
  const activeUser = freshUser || user;
  if (!activeUser?.id) { setAuthReason("save"); setShowAuth(true); return; }

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData?.session) {
    setUser(null);
    setAuthReason("save");
    setShowAuth(true);
    return;
  }

  const ingredientNames = (selectedMeal.ingredients || [])
    .map(i => i.name).join(" ");

  const searchText = [
    selectedMeal.name,
    selectedMeal.description,
    selectedMeal.cuisine,
    ingredientNames,
  ].filter(Boolean).join(" ").toLowerCase();

  const { error } = await supabase.from("recipes").insert({
    user_id:     activeUser.id,
    name:        selectedMeal.name,
    icon:        selectedMeal.icon,
    cuisine:     selectedMeal.cuisine,
    time:        selectedMeal.time,
    calories:    selectedMeal.calories,
    servings:    prefs?.people ?? null,
    meal_data:   selectedMeal,
    search_text: searchText,
  });

if (error) { console.error("Save failed — full error:", JSON.stringify(error, null, 2)); return; }
  setRecipeSaved(true);
  showToast("saved");
  setSavedMealNames(prev => new Set([...prev, selectedMeal.name]));
}

function handleMyRecipesNav() {
  if (user) { setScreen("myrecipes"); }
  else { setAuthReason("myrecipes"); setShowAuth(true); }
}

function handleProfileNav() {
  if (user) { setScreen("profile"); }
  else { setAuthReason("profile"); setShowAuth(true); }
}

async function handleAuthSuccess(freshUser) {
  if (authReason === "save") { await handleBookmarkPress(freshUser); }
  if (authReason === "myrecipes") { setShowAuth(false); setScreen("myrecipes"); }
  if (authReason === "profile") { setShowAuth(false); }
}

async function handleViewSaved(freshUser) {
  await handleBookmarkPress(freshUser);
  setShowAuth(false);
  setScreen("myrecipes");
}

  function handleNewSearch() {
  setMeals(null);
  setPrefs(null);
  setSelectedMeal(null);
  setRecipeSaved(false);
  setSavedMealNames(new Set());
  setScreen("input");
}

function handleViewRecipeFromModal(meal) {
  if (meal) {
    setSelectedMeal(meal);
    setRecipeSaved(savedMealNames.has(meal.name));
    setPreviousScreen("results");
    setScreen("recipe");
  } else {
    setScreen("results");
  }
}

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
      const newMeals = JSON.parse(c).map((m, i) => ({ ...m, id: i + 1 }));
      setMeals(newMeals);
      await checkSavedMeals(newMeals, user);
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

const showNav = screen !== "ds" && !isLoading;
  
return (
    <div style={{ background: C.strokeWeak, minHeight: "100vh", display: "flex", justifyContent: "center", fontFamily: F, overflowY: "scroll" }}>
      <div style={{ width: "390px", minHeight: "100vh", background: C.fill, fontFamily: F }}>
       {showAuth && (
  <AuthSheet
    reason={authReason}
    onSuccess={handleAuthSuccess}
    onViewSaved={handleViewSaved}
    onClose={() => setShowAuth(false)}
  />
)}
        {isLoading && <LoadingScreen />}
        {!isLoading && screen === "input" && (
  <PageTemplate title="What's for dinner tonight?">
<InputScreen
      onGenerate={handleGenerate}
      isLoading={isLoading}
      onShowDS={() => setScreen("ds")}
      hasResults={!!meals && meals.length > 0}
      meals={meals}
      savedMealNames={savedMealNames}
      onNewSearch={handleNewSearch}
      onViewRecipe={handleViewRecipeFromModal}
    />  </PageTemplate>
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
onSelect={m => { setSelectedMeal(m); setRecipeSaved(false); setPreviousScreen("results"); setScreen("recipe"); }}      
      onRemix={m => { setSelectedMeal(m); }}
      onRegenerate={updatedPrefs => handleGenerate(updatedPrefs)}
    />
  </PageTemplate>
)}

        {screen === "recipe" && selectedMeal && (
          <PageTemplate
            showBack
onBack={() => setScreen(previousScreen)}
            title={selectedMeal.name}
            chips={recipeChips}
            actions={[
              {
                icon: <BookmarkIcon filled={recipeSaved} />,
                onPress: handleBookmarkPress,
              }
            ]}
          >
            <RecipeScreen
              meal={selectedMeal}
              prefs={prefs}
            />
          </PageTemplate>
        )}

        {screen === "myrecipes" && (
  <PageTemplate
    title="My recipes"
    actions={[
      {
        icon: <span className="material-symbols-outlined" style={{ fontSize:"24px", fontVariationSettings:"'FILL' 1, 'wght' 500", color: C.textStrong }}>search</span>,
        onPress: () => {},
      },
      {
        icon: <span className="material-symbols-outlined" style={{ fontSize:"24px", fontVariationSettings:"'FILL' 1, 'wght' 500", color: C.textStrong }}>add</span>,
        onPress: () => setShowAdd(true),
        variant: "primary",
      },
    ]}
  >
    <MyRecipesScreen
  user={user}
onSelect={m => { setSelectedMeal(m); setRecipeSaved(true); setPreviousScreen("myrecipes"); setScreen("recipe"); }}
      onRemix={m => { setSelectedMeal(m); }}
    />
  </PageTemplate>
)}

{showAdd && (
  <AddRecipeModal
    onClose={() => setShowAdd(false)}
    onSaved={(recipe) => {
      setShowAdd(false);
      if (recipe) {
        setSelectedMeal(recipe);
        setPreviousScreen("myrecipes");
        setScreen("recipe");
      } else {
        setScreen("myrecipes");
      }
    }}
    user={user}
  />
)}
        
        <Toast
          toast={toast}
          onUndo={handleUndoToast}
          onHide={() => setToast(null)}
        />

        {showNav && (
          <BottomNav
            active={screen === "myrecipes" ? "myrecipes" : "home"}
            onHome={() => setScreen("input")}
            onMyRecipes={handleMyRecipesNav}
            onProfile={handleProfileNav}

          />
        )}

      </div>
    </div>
  );
}
