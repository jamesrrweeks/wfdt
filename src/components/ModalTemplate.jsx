import { C, SPACE, SHADOW } from "../tokens.js";

/**
 * ModalTemplate
 *
 * Shared shell for all WFDT bottom sheet modals.
 * Backdrop + white sheet + drag handle.
 * Height: 75vh, min 480px.
 * Width: responsive, min 320px, max 480px.
 *
 * Props:
 *   onClose  {fn}   — called when backdrop is tapped
 *   children {node} — Information block + Actions block
 */
export default function ModalTemplate({ onClose, children }) {
  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(100%); }
          to   { transform: translateX(-50%) translateY(0); }
        }
      `}</style>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(61,51,26,0.4)",
          zIndex: 99,
        }}
      />

      {/* Sheet */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          animation: "slideUp 0.32s cubic-bezier(0.32, 0.72, 0, 1)",
          width: "min(100%, 480px)",
          minWidth: "320px",
          height: "75vh",
          minHeight: "480px",
          background: C.background,
          borderRadius: `${SPACE.m}px ${SPACE.m}px 0 0`,
          boxShadow: SHADOW.overlay,
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: `${SPACE.xl}px ${SPACE.l}px`,
          boxSizing: "border-box",
        }}
      >
        {/* Drag handle */}
        <div style={{
          position: "absolute",
          top: `${SPACE.xxs + 1}px`,
          left: "50%",
          transform: "translateX(-50%)",
          width: "65px",
          height: "7px",
          background: C.strokeStrong,
          borderRadius: `${SPACE.xs}px`,
        }} />

        {children}
      </div>
    </>
  );
}
