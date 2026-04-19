import { useEffect, useRef, useState } from "react";
import { C, SPACE, T, F, SHADOW } from "../tokens.js";

/**
 * Toast
 *
 * Renders above BottomNav (zIndex 40, nav is 55).
 * Animates up from behind the nav on show, slides back down on hide.
 *
 * Props:
 *   toast    { type: "saved" | "removed" } | null  — null = hidden
 *   onUndo   fn  — called when user taps UNDO
 *   onHide   fn  — called when auto-dismiss timer fires (App clears toast state)
 */
export default function Toast({ toast, onUndo, onHide }) {
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef(null);

  useEffect(() => {
    if (toast) {
      setVisible(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        setVisible(false);
        setTimeout(onHide, 320);
      }, 3000);
    } else {
      setVisible(false);
    }
    return () => clearTimeout(hideTimer.current);
  }, [toast]);

  const isSaved = toast?.type === "saved";

  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        width: "390px",
        bottom: 0,
        zIndex: 40,
        paddingLeft: SPACE.s,
        paddingRight: SPACE.s,
        boxSizing: "border-box",
        pointerEvents: toast ? "auto" : "none",
      }}
    >
      <div
        style={{
          height: `${SPACE.xl}px`,
          background: C.textWeak,
          borderRadius: 8,
          boxShadow: SHADOW.overlay,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `10px ${SPACE.s}px`,
          transition: visible
            ? "bottom 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease"
            : "bottom 0.3s cubic-bezier(0.4, 0, 1, 1), opacity 0.2s ease",
        opacity: visible ? 1 : 0,
          position: "relative",
          bottom: visible ? 109 : 0,
        }}
      >
        {/* Left: icon + label */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: SPACE.xs }}>
          {isSaved && (
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 20,
                color: C.background,
                fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                lineHeight: 1,
              }}
            >
              check_circle
            </span>
          )}
          <span style={{ ...T.small, fontWeight: 700, color: C.background, whiteSpace: "nowrap" }}>
            {isSaved ? "Saved to My recipes." : "Removed from My recipes."}
          </span>
        </div>

        {/* Right: UNDO */}
        <button
          onClick={onUndo}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            ...T.tiny,
            fontWeight: 700,
            fontFamily: F,
            color: C.background,
            textDecoration: "underline",
            flexShrink: 0,
          }}
        >
          UNDO
        </button>
      </div>
    </div>
  );
}
