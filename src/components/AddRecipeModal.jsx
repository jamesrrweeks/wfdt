import { useState } from "react";
import { C, SPACE, T } from "../tokens.js";
import ModalTemplate from "./ModalTemplate.jsx";
import { supabase } from "../supabase.js";

// view: "launcher" | "paste" | "url" | "thinking" | "saved" | "error"
export default function AddRecipeModal({ onClose, onSaved, user }) {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [view, setView] = useState("launcher");
  const [progressWidth, setProgressWidth] = useState(0);
  const [imageFile, setImageFile]         = useState(null);
  const [imagePreview, setImagePreview]   = useState(null);

  // ── Shared progress bar helper ──────────────────────────────────
  function startProgress() {
    let width = 0;
    const interval = setInterval(() => {
      width += Math.random() * 4 + 1;
      if (width >= 90) width = 90;
      setProgressWidth(width);
    }, 200);
    return interval;
  }

  // ── Shared Supabase insert ──────────────────────────────────────
  async function saveRecipe(recipe, interval) {
    const { error: insertError } = await supabase.from("recipes").insert({
      user_id:     user.id,
      name:        recipe.name,
      icon:        recipe.icon ?? "Vegetarian",
      cuisine:     recipe.cuisine,
      time:        recipe.time,
      calories:    recipe.calories,
      servings:    recipe.servings,
      meal_data:   recipe,
      search_text: [recipe.name, recipe.description, recipe.cuisine].filter(Boolean).join(" ").toLowerCase(),
    });
    if (insertError) { clearInterval(interval); setView("error"); return false; }
    return true;
  }

  // ── PASTE submit ────────────────────────────────────────────────
  async function handleSubmit() {
    if (!text.trim()) return;
    setView("thinking");
    const interval = startProgress();

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

      if (raw === "ERROR") { setTimeout(() => setView("error"), 300); return; }

      const recipe = JSON.parse(raw.replace(/```json|```/g, "").trim());
      const ok = await saveRecipe(recipe, interval);
      if (ok) setTimeout(() => { setView("saved"); if (onSaved) onSaved(recipe); }, 300);

    } catch {
      clearInterval(interval);
      setView("error");
    }
  }

  // ── URL submit ──────────────────────────────────────────────────
  async function handleUrlSubmit() {
    if (!url.trim()) return;
    setView("thinking");
    const interval = startProgress();

    try {
      const response = await fetch("/api/parse-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-secret-token": import.meta.env.VITE_API_SECRET_TOKEN,
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      const raw = data.content[0].text.trim();
      clearInterval(interval);
      setProgressWidth(100);

      if (raw === "ERROR") { setTimeout(() => setView("error"), 300); return; }

      const recipe = JSON.parse(raw.replace(/```json|```/g, "").trim());
      const ok = await saveRecipe(recipe, interval);
      if (ok) setTimeout(() => { setView("saved"); if (onSaved) onSaved(recipe); }, 300);

    } catch {
      clearInterval(interval);
      setView("error");
    }
  }

  // ── IMAGE submit ────────────────────────────────────────────────
  async function handleImageSubmit() {
    if (!imageFile) return;
    setView("thinking");
    const interval = startProgress();
    try {
      const base64 = await new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(imageFile);
        img.onload = () => {
          URL.revokeObjectURL(objectUrl);
          const MAX = 1200;
          const scale = Math.min(1, MAX / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width  = Math.round(img.width  * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.85).split(",")[1]);
        };
        img.onerror = () => reject(new Error("Image load failed"));
        img.src = objectUrl;
      });
      const response = await fetch("/api/parse-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-secret-token": import.meta.env.VITE_API_SECRET_TOKEN,
        },
        body: JSON.stringify({ imageBase64: base64, mediaType: imageFile.type }),
      });
      const data = await response.json();
      const raw = data.content[0].text.trim();
      clearInterval(interval);
      setProgressWidth(100);
      if (raw === "ERROR") { setTimeout(() => setView("error"), 300); return; }
      const recipe = JSON.parse(raw.replace(/```json|```/g, "").trim());
      const ok = await saveRecipe(recipe, interval);
      if (ok) setTimeout(() => { setView("saved"); if (onSaved) onSaved(recipe); }, 300);
    } catch {
      clearInterval(interval);
      setView("error");
    }
  }

  // ── File picker handler ─────────────────────────────────────────
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  // ── LAUNCHER view ───────────────────────────────────────────────
  if (view === "launcher") {
    return (
      <ModalTemplate onClose={onClose}>
        <div style={{ display: "flex", flexDirection: "column", gap: `${SPACE.xs}px`, width: "100%" }}>
          <div style={{ ...T.h1, color: C.textStrong }}>Add a recipe</div>
          <div style={{ ...T.small, color: C.textWeak }}>Add an existing recipe from anywhere</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: `${SPACE.l}px`, width: "100%" }}>
          {/* Paste row */}
          <button
            onClick={() => setView("paste")}
            style={{ display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", width: "100%" }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 80, background: C.strokeWeak, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: C.textStrong, fontVariationSettings: "'FILL' 0, 'wght' 400" }}>content_paste_go</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: `${SPACE.xxs}px` }}>
              <div style={{ ...T.h3, color: C.textStrong }}>Paste</div>
              <div style={{ ...T.tiny, color: C.textWeak }}>Copy and paste a recipe into your collection</div>
            </div>
          </button>
          {/* URL row */}
          <button
            onClick={() => setView("url")}
            style={{ display: "flex", alignItems: "flex-start", gap: "10px", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", width: "100%" }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 80, background: C.strokeWeak, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: C.textStrong, fontVariationSettings: "'FILL' 0, 'wght' 400" }}>link</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: `${SPACE.xxs}px` }}>
              <div style={{ ...T.h3, color: C.textStrong }}>URL</div>
              <div style={{ ...T.tiny, color: C.textWeak }}>Paste a URL to add a recipe to your collection</div>
            </div>
          </button>
        {/* Image row */}
          <button
            onClick={() => setView("image")}
            style={{ display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", width: "100%" }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 80, background: C.strokeWeak, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: C.textStrong, fontVariationSettings: "'FILL' 0, 'wght' 400" }}>add_photo_alternate</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: `${SPACE.xxs}px` }}>
              <div style={{ ...T.h3, color: C.textStrong }}>Image</div>
              <div style={{ ...T.tiny, color: C.textWeak }}>Upload a photo or screenshot of a recipe</div>
            </div>
          </button>
        </div>
      </ModalTemplate>
    );
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

  // ── URL view ────────────────────────────────────────────────────
  if (view === "url") {
    return (
      <ModalTemplate onClose={onClose}>
        <div style={{ display: "flex", flexDirection: "column", gap: `${SPACE.xs}px`, width: "100%" }}>
          <div style={{ ...T.h1, color: C.textStrong }}>URL</div>
          <div style={{ ...T.tiny, color: C.textWeak }}>Paste a recipe URL to add it to your collection</div>
        </div>
        <div style={{ width: "100%", position: "relative" }}>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://..."
            style={{
              width: "100%",
              height: "56px",
              background: C.background,
              border: `1px solid ${C.textStrong}`,
              borderRadius: `${SPACE.s}px`,
              padding: `${SPACE.s}px ${SPACE.m}px`,
              paddingRight: "52px",
              fontFamily: "'Atkinson Hyperlegible', sans-serif",
              fontSize: "16px",
              lineHeight: "24px",
              color: C.textStrong,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          {url.trim().length > 0 && (
            <button
              onClick={handleUrlSubmit}
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
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

  // ── IMAGE view ──────────────────────────────────────────────────
  if (view === "image") {
    return (
      <ModalTemplate onClose={onClose}>
        <div style={{ display: "flex", flexDirection: "column", gap: `${SPACE.xs}px`, width: "100%" }}>
          <div style={{ ...T.h1, color: C.textStrong }}>Image</div>
          <div style={{ ...T.tiny, color: C.textWeak }}>Upload a photo or screenshot of a recipe to add to your collection</div>
        </div>
        <label style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: `${SPACE.s}px`, width: "100%", minHeight: "140px",
          border: `2px dashed ${imageFile ? C.primary : C.strokeStrong}`,
          borderRadius: `${SPACE.s}px`,
          background: imageFile ? "rgba(205,234,69,0.06)" : C.background,
          cursor: "pointer", boxSizing: "border-box", padding: `${SPACE.m}px`,
          transition: "border-color 0.2s, background 0.2s", overflow: "hidden",
        }}>
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="Recipe preview" style={{ width: "100%", maxHeight: "120px", objectFit: "cover", borderRadius: "8px" }} />
              <div style={{ ...T.tiny, color: C.textWeak, textAlign: "center", wordBreak: "break-all" }}>{imageFile.name}</div>
            </>
          ) : (
            <>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.strokeWeak, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 24, color: C.textWeak, fontVariationSettings: "'FILL' 0, 'wght' 400" }}>add_photo_alternate</span>
              </div>
              <div style={{ ...T.small, color: C.textStrong, fontWeight: 700, textAlign: "center" }}>Tap to choose a photo</div>
              <div style={{ ...T.tiny, color: C.textWeak, textAlign: "center" }}>Opens your photo library or camera</div>
            </>
          )}
        </label>
        <button
          onClick={handleImageSubmit}
          disabled={!imageFile}
          style={{
            width: "100%", height: "48px",
            background: imageFile ? C.primary : C.strokeWeak,
            borderRadius: "32px", border: "none",
            fontFamily: "'Atkinson Hyperlegible', sans-serif",
            fontSize: "16px", fontWeight: 700,
            color: imageFile ? C.textStrong : C.textWeak,
            cursor: imageFile ? "pointer" : "not-allowed",
            transition: "background 0.2s, color 0.2s",
          }}
        >
          Add recipe
        </button>
      </ModalTemplate>
    );
  }

  // ── THINKING view ───────────────────────────────────────────────
  if (view === "thinking") {
    return (
      <ModalTemplate onClose={onClose}>
        <div style={{ display: "flex", flexDirection: "column", gap: `${SPACE.xs}px`, width: "100%" }}>
          <div style={{ ...T.h1, color: C.textStrong }}>Adding your recipe</div>
          <div style={{ ...T.tiny, color: C.textWeak }}>This usually takes a few seconds</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: `${SPACE.l}px`, width: "100%" }}>
          {/* Progress track */}
          <div style={{ width: "100%", height: "5px", background: C.strokeWeak, borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ height: "5px", width: `${progressWidth}%`, background: C.primary, borderRadius: "8px", transition: "width 0.3s ease" }} />
          </div>
          {/* Show image thumbnail if from image flow, otherwise text/url */}
          {imagePreview ? (
            <img src={imagePreview} alt="Recipe being processed" style={{ width: "100%", maxHeight: "120px", objectFit: "cover", borderRadius: "8px", opacity: 0.6 }} />
          ) : (
            <div style={{
              width: "100%", background: C.background,
              border: `1px solid ${C.strokeStrong}`,
              borderRadius: `${SPACE.s}px`,
              padding: `${SPACE.s}px ${SPACE.m}px`,
              boxSizing: "border-box",
              fontFamily: "'Atkinson Hyperlegible', sans-serif",
              fontSize: "16px", lineHeight: "24px",
              color: C.strokeStrong, minHeight: "56px", wordBreak: "break-all",
            }}>
              {text || url}
            </div>
          )}
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
