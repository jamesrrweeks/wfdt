import { C, SPACE, T, F } from "../tokens.js";
import ModalTemplate from "./ModalTemplate.jsx";

export default function AddRecipeModal({ onClose }) {
  return (
    <ModalTemplate onClose={onClose}>

      {/* Information block — sits at top */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: `${SPACE.xs}px`,
        width: "100%",
      }}>
        <div style={{ ...T.h1, color: C.textStrong }}>
          Add a recipe
        </div>
        <div style={{ ...T.tiny, color: C.textWeak }}>
          Add an existing recipe from anywhere
        </div>
      </div>

      {/* Actions block — sits at bottom */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: `${SPACE.l}px`,
        width: "100%",
      }}>
        <div style={{ ...T.small, color: C.textWeak }}>
          ← options go here
        </div>
      </div>

    </ModalTemplate>
  );
}
