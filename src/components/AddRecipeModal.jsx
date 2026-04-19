import { useState } from "react";
import { C, SPACE, T } from "../tokens.js";
import ModalTemplate from "./ModalTemplate.jsx";

export default function AddRecipeModal({ onClose }) {
  const [text, setText] = useState("");

  return (
    <ModalTemplate onClose={onClose}>

      {/* Information block — top */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: `${SPACE.xs}px`,
        width: "100%",
      }}>
        <div style={{ ...T.h1, color: C.textStrong }}>
          Paste
        </div>
        <div style={{ ...T.tiny, color: C.textWeak }}>
          Copy and paste a recipe into your collection
        </div>
      </div>

      {/* Actions block — bottom */}
      <div style={{ width: "100%" }}>
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
      </div>

    </ModalTemplate>
  );
}
