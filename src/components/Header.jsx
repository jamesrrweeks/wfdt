import { C, SPACE, F, SHADOW } from "../tokens.js";

function BackIcon() {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
      <path d="M8.5 1L1.5 8L8.5 15" stroke={C.textWeak} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/**
 * Header
 *
 * Always 48px tall. Always present. Never collapses.
 * Back button and action buttons are hidden when not provided — the zone stays.
 * No side padding — inherits from PageTemplate's inner content div.
 *
 * Props:
 *   showBack    {bool}     — show the back button
 *   onBack      {fn}       — callback for back button tap
 *   actions     {array}    — up to 3 action buttons: [{ icon: <svg/>, onPress: fn }]
 */
export default function Header({ showBack = false, onBack, actions = [] }) {
  return (
    <div style={{
      height: "48px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexShrink: 0,
    }}>

      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          visibility: showBack ? "visible" : "hidden",
        }}
      >
        <BackIcon />
        <span style={{
          fontFamily: F,
          fontSize: "14px",
          lineHeight: "20px",
          color: C.textWeak,
          textDecoration: "underline",
        }}>
          Back
        </span>
      </button>

      <div style={{
        display: "flex",
        gap: `${SPACE.xs}px`,
        visibility: actions.length > 0 ? "visible" : "hidden",
      }}>
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => action.onPress()}
            style={{
  width: "48px",
  height: "48px",
  background: action.variant === "primary" ? C.primary : C.background,
  border: action.variant === "primary" ? "none" : `1px solid ${C.strokeWeak}`,
  boxShadow: SHADOW.overlay,
  borderRadius: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
}}
          >
            {action.icon}
          </button>
        ))}
      </div>

    </div>
  );
}
