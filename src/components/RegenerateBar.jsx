import { C, F, SHADOW, SPACE } from "../tokens.js";

const RefreshIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M23 4V10H17" stroke={C.textStrong} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20.49 15C19.84 16.84 18.61 18.42 16.98 19.5C15.36 20.58 13.43 21.1 11.48 20.99C9.53 20.87 7.67 20.13 6.18 18.87C4.7 17.6 3.66 15.89 3.23 13.99C2.8 12.09 2.99 10.1 3.79 8.32C4.59 6.53 5.95 5.06 7.66 4.12C9.37 3.18 11.34 2.82 13.28 3.09C15.22 3.37 17.02 4.26 18.42 5.64L23 10" stroke={C.textStrong} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function RegenerateBar({ visible, loading, onRegenerate }) {
  if (!visible) return null;

  return (
    <div style={{
      position:      "fixed",
      bottom:        `${SPACE.xxl}px`,
      left:          "50%",
      transform:     "translateX(-50%)",
      width:         "390px",
      padding:       `${SPACE.xxl + SPACE.m}px ${SPACE.s}px ${SPACE.m}px`,
      background:    "linear-gradient(to top, #F0ECE4 60%, transparent)",
      display:       "flex",
      flexDirection: "column",
      alignItems:    "stretch",
      gap:           8,
      zIndex:        50,
      pointerEvents: "auto",
    }}>
      <button
        onClick={onRegenerate}
        disabled={loading}
        style={{
          display:        "flex",
          flexDirection:  "row",
          justifyContent: "center",
          alignItems:     "center",
          gap:            8,
          height:         52,
          background:     loading ? C.strokeWeak : C.primary,
          borderRadius:   32,
          border:         "none",
          cursor:         loading ? "default" : "pointer",
          fontFamily:     F,
          fontWeight:     "700",
          fontSize:       16,
          lineHeight:     "24px",
          color:          C.textStrong,
          boxShadow:      SHADOW.overlay,
          transition:     "background 0.15s",
        }}
      >
        {loading ? (
          <>
            <span style={{
              width:           16,
              height:          16,
              border:          `2px solid ${C.textStrong}`,
              borderTopColor:  "transparent",
              borderRadius:    "50%",
              display:         "inline-block",
              animation:       "spin 0.8s linear infinite",
            }} />
            Regenerating…
          </>
        ) : (
          <>
            <RefreshIcon />
            Regenerate recipe
          </>
        )}
      </button>
      <p style={{
        fontFamily: F,
        fontSize:   12,
        lineHeight: "16px",
        color:      C.textWeak,
        textAlign:  "center",
        margin:     0,
      }}>
        Rewrites the method using your updated ingredients
      </p>
    </div>
  );
}
