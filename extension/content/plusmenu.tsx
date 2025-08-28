import React from "react";
import { createRoot } from "react-dom/client";
import { getInputEl, injectValue } from "./injector";
import { buildLocalSuggestion, detectLocale } from "./slotfill";
import { routeIntent } from "./router";

export function mountFloatingPlus() {
  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.bottom = "18px";
  host.style.right = "18px";
  host.style.zIndex = "2147483646";
  document.body.appendChild(host);
  const root = createRoot(host);
  const Btn = () => (
    <button
      onClick={() => {
        const el = getInputEl();
        if (!el) return;
        const raw = (el as HTMLTextAreaElement).value;
        const locale = detectLocale(raw);
        const intent = routeIntent(raw);
        const { instruction } = buildLocalSuggestion(raw, locale, intent);
        injectValue(instruction);
      }}
      style={{
        borderRadius: "999px",
        width: 44,
        height: 44,
        border: "1px solid #444",
        background: "#111",
        color: "#fff",
        cursor: "pointer",
        fontSize: 22,
      }}
      title="Rewrite"
    >
      +
    </button>
  );
  root.render(<Btn />);
}
