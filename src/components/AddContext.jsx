import { useState, useRef, useEffect } from "react";
import { C, SPACE, T } from "../tokens.js";
import { AddIcon, RecordIcon, SubmitIcon } from "../icons.jsx";

export default function AddContext({ value: controlledValue, onChange, onAdd, placeholder="Any context? (leftovers, mood…)" }) {
  const [internalValue, setInternalValue] = useState("");
  const [focused, setFocused]             = useState(false);
  const textareaRef                        = useRef(null);

  const isControlled = controlledValue !== undefined;
  const value        = isControlled ? controlledValue : internalValue;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    if (!value) { el.style.height = "20px"; }
    else        { el.style.height = "auto"; el.style.height = `${el.scrollHeight}px`; }
  }, [value]);

  const handleChange = (e) => {
    if (!isControlled) setInternalValue(e.target.value);
    if (typeof onChange === "function") onChange(e.target.value);
  };

  const handleAdd = () => {
    if (typeof onAdd === "function") onAdd(value);
    if (!isControlled) setInternalValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAdd(); }
  };

  return (
    <div style={{ display:"flex", flexDirection:"row", alignItems:"flex-start", gap:`${SPACE.xs}px`, width:"100%" }}>
      <button onClick={handleAdd} aria-label="Add context" style={{
        width:36, height:36, flexShrink:0,
        background:C.background, border:`1px solid ${C.strokeStrong}`,
        borderRadius:"48px", display:"flex", alignItems:"center",
        justifyContent:"center", cursor:"pointer", padding:0,
      }}
        onMouseEnter={e=>{e.currentTarget.style.background=C.fill;}}
        onMouseLeave={e=>{e.currentTarget.style.background=C.background;}}
      ><AddIcon/></button>

      <div style={{
        display:"flex", flexDirection:"row", alignItems:"center",
        padding:`${SPACE.xs}px 42px ${SPACE.xs}px ${SPACE.s}px`,
        flex:1, minHeight:"36px", position:"relative",
        background:C.background,
        border:`1px solid ${focused ? C.textWeak : C.strokeStrong}`,
        borderRadius:"32px", transition:"border-color 0.15s",
      }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onFocus={()=>setFocused(true)}
          onBlur={()=>setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          style={{
            flex:1, border:"none", outline:"none", background:"transparent",
            resize:"none", overflow:"hidden", ...T.tiny, color:C.textStrong,
            minWidth:0, padding:0, margin:0, lineHeight:"20px", height:"20px",
          }}
        />
        {value ? (
          <button onClick={handleAdd} aria-label="Submit" style={{
            position:"absolute", right:"5px", top:"50%", transform:"translateY(-50%)",
            width:26, height:26, border:"none", background:"transparent",
            display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", padding:0,
          }}><SubmitIcon/></button>
        ) : (
          <button aria-label="Record" style={{
            position:"absolute", right:"11px", top:"50%", transform:"translateY(-50%)",
            width:20, height:20, border:"none", background:"transparent",
            display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", padding:0,
          }}><RecordIcon/></button>
        )}
      </div>
    </div>
  );
}
