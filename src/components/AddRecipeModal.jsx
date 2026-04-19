import { useState } from "react";
import { C, SPACE, T } from "../tokens.js";
import ModalTemplate from "./ModalTemplate.jsx";
import { supabase } from "../supabase.js";

// view: "paste" | "thinking" | "saved" | "error"
export default function AddRecipeModal({ onClose, onSaved, user }) {
  const [text, setText] = useState("");
  const [view, setView] = useState("paste");
  const [progressWidth, setProgressWidth] = useState(0);

  async function handleSubmit() {
    if (!text.trim()) return;
    setView("thinking");

    // Animate progress bar
    let width = 0;
    const interval = setInterval(() => {
      width += Math.random() * 4 + 1;
      if (width >= 90) width = 90;
      setProgressWidth(width);
    }, 200);

    try {
      const response = await fetch("/api/parse-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-secret-token": import.meta.env.VITE_API_SECRET_TOKEN,
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      const raw = data.content[0].text.trim();
      clearInterval(interval);
      setProgressWidth(100);

      if (raw === "ERROR") {
        setTimeout(() => setView("error"), 300);
        return;
      }

      const clean = raw.replace(/```json|```/g, "").trim();
      const recipe = JSON.parse(clean);

      const { error: insertError } = await supabase.from("recipes").insert({
        user_id:   user.id,
        name:      recipe.name,
        icon:      recipe.icon ?? "Vegetarian",
        cuisine:   recipe.cuisine,
        time:      recipe.time,
        calories:  recipe.calories,
        servings:  recipe.servings,
        meal_data: recipe,
        search_text: [recipe.name, recipe.description, recipe.cuisine].filter(Boolean).join(" ").toLowerCase(),
      });

      if (insertError) { clearInterval(interval); setView("error"); return; }

      setTimeout(() => {
        setView("saved");
        if (onSaved) onSaved(recipe);
      }, 300);

    } catch {
      clearInterval(interval);
      setView("error");
    }
  }

  // ── PASTE view ──────────────────────────────────────────────────
  if (view === "paste") {
    return (
      <ModalTemplate onClose={onClose}>
        <div style={{ display: "flex", flexDirection: "column", gap: `${SPACE.xs}px`, width: "100%" }}>
          <div style={{ ...T.h1, color: C.textStrong }}>Paste</div>
          <div style={{ ...T.tiny, color: C.textWeak }}>Copy and paste a recipe into your collection</div>
        </div>
        <div style={{ width: "100%", position: "relative" }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste recipe..."
            style={{
              width: "100%",
              minHeight: "56px",
              maxHeight: "340px",
              background: C.background,
              border: `1px solid ${C.textStrong}`,
              borderRadius: `${SPACE.s}px`,
              padding: `${SPACE.s}px ${SPACE.m}px`,
              paddingRight: "52px",
              fontFamily: "'Atkinson Hyperlegible', sans-serif",
              fontSize: "16px",
              lineHeight: "24px",
              color: C.textStrong,
              resize: "none",
              outline: "none",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
            onInput={e => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 340) + "px";
            }}
          />
          {text.trim().length > 0 && (
            <button
              onClick={handleSubmit}
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                background: C.textStrong,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px", color: C.background, fontVariationSettings: "'FILL' 1, 'wght' 400" }}>
                arrow_upward
              </span>
            </button>
          )}
        </div>
      </ModalTemplate>
    );
  }

  // ── THINKING view ───────────────────────────────────────────────
  if (view === "thinking") {
    return (
      <ModalTemplate onClose={onClose}>
        <div style={{ display: "flex", flexDirection: "column", gap: `${SPACE.xs}px`, width: "100%" }}>
          <div style={{ ...T.h1, color: C.textStrong }}>Paste</div>
          <div style={{ ...T.tiny, color: C.textWeak }}>Copy and paste a recipe into your collection</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: `${SPACE.l}px`, width: "100%" }}>
          {/* Progress track */}
          <div style={{ width: "100%", height: "5px", background: C.strokeWeak, borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ height: "5px", width: `${progressWidth}%`, background: C.primary, borderRadius: "8px", transition: "width 0.3s ease" }} />
          </div>
          {/* Greyed field */}
          <div style={{
            width: "100%",
            background: C.background,
            border: `1px solid ${C.strokeStrong}`,
            borderRadius: `${SPACE.s}px`,
            padding: `${SPACE.s}px ${SPACE.m}px`,
            boxSizing: "border-box",
            fontFamily: "'Atkinson Hyperlegible', sans-serif",
            fontSize: "16px",
            lineHeight: "24px",
            color: C.strokeStrong,
            minHeight: "56px",
          }}>
            {text}
          </div>
        </div>
      </ModalTemplate>
    );
  }

  // ── SAVED view ──────────────────────────────────────────────────
  if (view === "saved") {
    return (
      <ModalTemplate onClose={onClose}>
        <div style={{ display: "flex", flexDirection: "column", gap: `${SPACE.s}px`, width: "100%" }}>
          <div style={{ ...T.h1, color: C.textStrong }}>Your recipe has been uploaded</div>
          <div style={{ ...T.tiny, color: C.textWeak }}>You can always come back to it in My recipes.</div>
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%",
            background: C.primary,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: "38px", color: C.textStrong, fontVariationSettings: "'FILL' 1, 'wght' 400" }}>
              check
            </span>
          </div>
        </div>
        <button
          onClick={() => onSaved && onSaved()}
          style={{
            width: "100%", height: "48px",
            background: C.textStrong,
            borderRadius: "32px",
            border: "none",
            fontFamily: "'Atkinson Hyperlegible', sans-serif",
            fontSize: "16px", fontWeight: 700,
            color: C.fill,
            cursor: "pointer",
          }}
        >
          View recipe
        </button>
      </ModalTemplate>
    );
  }

  // ── ERROR view ──────────────────────────────────────────────────
  if (view === "error") {
    return (
      <ModalTemplate onClose={onClose}>
        <div style={{ display: "flex", flexDirection: "column", gap: `${SPACE.s}px`, width: "100%" }}>
          <div style={{ ...T.h1, color: C.textStrong }}>Recipe not uploaded</div>
          <div style={{ ...T.tiny, color: C.textWeak }}>Your recipe was too difficult to read or didn't have enough information to make a recipe.</div>
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%",
            background: "#FFDFE0",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: "32px", color: C.red, fontVariationSettings: "'FILL' 1, 'wght' 400" }}>
              close
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: "100%", height: "48px",
            background: "transparent",
            borderRadius: "32px",
            border: `1px solid ${C.textStrong}`,
            fontFamily: "'Atkinson Hyperlegible', sans-serif",
            fontSize: "16px", fontWeight: 700,
            color: C.textStrong,
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </ModalTemplate>
    );
  }
}
