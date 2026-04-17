import { C, SPACE, T } from "../tokens.js";
import Header from "./Header.jsx";

/**
 * PageTemplate
 *
 * The shell that wraps every screen. Handles:
 *   - Header (back + action buttons)
 *   - Page info zone (H1 title + optional chips)
 *   - Scrollable content area with correct padding and section gaps
 *   - Bottom padding to clear the BottomNav (80px)
 *
 * Props:
 *   showBack    {bool}     — show back button in header
 *   onBack      {fn}       — back button callback
 *   actions     {array}    — header action buttons [{ icon, onPress }]
 *   title       {string}   — H1 page title (always shown)
 *   chips       {node}     — optional chip row rendered below title
 *   children    {node}     — page sections (each section handles its own heading + content)
 */
export default function PageTemplate({
  showBack = false,
  onBack,
  actions = [],
  title,
  chips,
  children,
}) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: C.strokeWeak,
      overflow: "hidden",
    }}>

      {/* Scrollable body */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
      }}>

        {/* Inner content — 32px top, 16px sides, sections gap 24px */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: `${SPACE.m}px`,
          paddingTop: `${SPACE.l}px`,
          paddingLeft: `${SPACE.s}px`,
          paddingRight: `${SPACE.s}px`,
          paddingBottom: "80px",
        }}>

          <Header showBack={showBack} onBack={onBack} actions={actions} />

          {/* Page info zone — H1 + optional chips */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: `${SPACE.s}px`,
          }}>
            {title && (
              <h1 style={{
                ...T.h1,
                color: C.textStrong,
                margin: 0,
              }}>
                {title}
              </h1>
            )}
            {chips && (
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
              }}>
                {chips}
              </div>
            )}
          </div>

          {/* Page sections */}
          {children}

        </div>
      </div>

    </div>
  );
}
