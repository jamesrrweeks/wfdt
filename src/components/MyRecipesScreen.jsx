import { C, SPACE, T } from "../tokens.js";
import MealCard from "./MealCard.jsx";
import { useState, useEffect } from "react";
import { supabase } from "../supabase.js";

const MOCK_SAVED = [
  {
    id: 1,
    name: "Butter Chicken",
    description: "A rich, creamy tomato-based curry with tender chicken pieces. Warming spices and a silky sauce make this a weeknight favourite the whole family will love.",
    cuisine: "Indian",
    time: "35 mins",
    calories: 520,
    icon: "Chicken",
  },
  {
    id: 2,
    name: "Beef Ragu Pappardelle",
    description: "Slow-cooked beef ragu with wide pappardelle pasta. A deeply savoury sauce that clings to every ribbon for a satisfying, hearty dinner.",
    cuisine: "Italian",
    time: "45 mins",
    calories: 680,
    icon: "Pasta & Noodles",
  },
  {
    id: 3,
    name: "Roasted Root Vege Bowl",
    description: "Golden roasted kumara, beetroot, and carrots on a bed of pearl couscous with a tahini drizzle. Simple, nourishing, and full of natural sweetness.",
    cuisine: "Vegetarian",
    time: "40 mins",
    calories: 410,
    icon: "Potato & Root",
  },
];

function EmptyState() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: `${SPACE.s}px`,
      padding: `${SPACE.xxl}px 0`,
      textAlign: "center",
    }}>
      <p style={{ ...T.small, color: C.textWeak }}>
        Your saved recipes will live here. Generate a meal and tap the bookmark to save it or add a recipe.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: `${SPACE.xxl}px 0`,
    }}>
      <p style={{ ...T.small, color: C.textWeak }}>Loading your recipes…</p>
    </div>
  );
}

export default function MyRecipesScreen({ user, onSelect, onRemix }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    async function fetchRecipes() {
      setLoading(true);
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) { console.error("Failed to load recipes:", error); setRecipes([]); }
      else { setRecipes(data ?? []); }
      setLoading(false);
    }
    fetchRecipes();
  }, [user?.id]);

  if (loading) return <LoadingState />;
  if (recipes.length === 0) return <EmptyState />;

  return (
    <>
      {recipes.map((row, i) => (
        <MealCard
          key={row.id}
          meal={row.meal_data}
          prefs={null}
          index={i}
          onRemix={() => onRemix?.(row.meal_data)}
          onView={() => onSelect?.(row.meal_data)}
        />
      ))}
    </>
  );
}
