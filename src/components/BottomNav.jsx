import { C, SPACE, F } from "../tokens.js";

// Inject Material Symbols Outlined font
const symLink = document.createElement("link");
symLink.rel = "stylesheet";
symLink.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,200,0,0";
document.head.appendChild(symLink);

const HomeIcon = ({ active }) => (
  <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 14.7885H4.69225V8.904H9.30775V14.7885H13V5.7885L7 1.25L1 5.7885V14.7885ZM0 15.7885V5.2885L7 0L14 5.2885V15.7885H8.30775V9.904H5.69225V15.7885H0Z"
      fill={active ? C.textStrong : C.textWeak}
    />
  </svg>
);

const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "6px 0px",
      gap: "1px",
      width: "100px",
      height: "53px",
      borderRadius: "32px",
      border: "none",
      background: "none",
      cursor: "pointer",
      flexShrink: 0,
    }}
  >
    {icon}
    <span
      style={{
        fontFamily: F,
        fontSize: "14px",
        lineHeight: "20px",
        fontWeight: "400",
        color: active ? C.textStrong : C.textWeak,
        textAlign: "center",
        width: "100px",
        textDecoration: active ? "underline" : "none",
      }}
    >
      {label}
    </span>
  </button>
);

const SymbolIcon = ({ name, active }) => (
  <span
    className="material-symbols-outlined"
    style={{
      fontSize: "24px",
      color: active ? C.textStrong : C.textWeak,
      fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 24",
    }}
  >
    {name}
  </span>
);

export default function BottomNav({ active = "home", onHome, onMyRecipes, onProfile }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "390px",
        height: "85px",
        background: C.background,
        borderRadius: "24px 24px 0px 0px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "wrap",
        alignContent: "center",
        padding: `${SPACE.xs}px ${SPACE.s}px 24px`,
        gap: "9px 16px",
        zIndex: 50,
        boxSizing: "border-box",
      }}
    >
      <NavItem
        icon={<HomeIcon active={active === "home"} />}
        label="Home"
        active={active === "home"}
        onClick={onHome}
      />
      <NavItem
        icon={<SymbolIcon name="collections_bookmark" active={active === "myrecipes"} />}
        label="My recipes"
        active={active === "myrecipes"}
        onClick={onMyRecipes}
      />
      <NavItem
        icon={<SymbolIcon name="account_circle" active={active === "profile"} />}
        label="Profile"
        active={active === "profile"}
        onClick={onProfile}
      />
    </div>
  );
}
