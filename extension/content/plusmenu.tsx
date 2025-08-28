import React from "react";
import { createRoot } from "react-dom/client";
import { getInputEl, injectValue } from "./injector";
import { buildLocalSuggestion, detectLocale } from "./slotfill";
import { routeIntent } from "./router";

export function mountFloatingPlus() {
  // Check if already mounted
  if (document.getElementById("epp-floating-plus")) return;

  const host = document.createElement("div");
  host.id = "epp-floating-plus";
  host.style.position = "fixed";
  host.style.bottom = "18px";
  host.style.right = "18px";
  host.style.zIndex = "2147483646";
  host.style.pointerEvents = "auto";
  host.style.cursor = "move";
  document.body.appendChild(host);

  // Make draggable
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  host.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = host.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;
    host.style.cursor = "grabbing";
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    const newLeft = startLeft + deltaX;
    const newTop = startTop + deltaY;

    // Keep within viewport bounds
    const maxLeft = window.innerWidth - 44;
    const maxTop = window.innerHeight - 44;

    host.style.left = `${Math.max(0, Math.min(newLeft, maxLeft))}px`;
    host.style.top = `${Math.max(0, Math.min(newTop, maxTop))}px`;
    host.style.right = "auto";
    host.style.bottom = "auto";
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      host.style.cursor = "move";
    }
  });

  const root = createRoot(host);
  const Btn = () => (
    <button
      onClick={(e) => {
        // Don't trigger if we just finished dragging
        if (isDragging) {
          e.preventDefault();
          return;
        }

        const el = getInputEl();
        if (!el) {
          console.log("EPP: No input element found");
          return;
        }
        
        let raw: string;
        if (el instanceof HTMLTextAreaElement) {
          raw = el.value;
        } else if (el instanceof HTMLDivElement && el.contentEditable === "true") {
          raw = el.textContent || el.innerText || "";
        } else {
          raw = (el as any).value || "";
        }
        
        if (!raw.trim()) {
          console.log("EPP: No text to rewrite");
          return;
        }
        const locale = detectLocale(raw);
        const intent = routeIntent(raw);
        const { instruction } = buildLocalSuggestion(raw, locale, intent);
        console.log("EPP: Rewriting with instruction:", instruction);
        injectValue(instruction);
      }}
      style={{
        borderRadius: "999px",
        width: 44,
        height: 44,
        border: "2px solid #4F8EF7",
        background: "#111",
        color: "#4F8EF7",
        cursor: "pointer",
        fontSize: 22,
        fontWeight: "bold",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#4F8EF7";
        e.currentTarget.style.color = "#000";
        e.currentTarget.style.transform = "scale(1.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#111";
        e.currentTarget.style.color = "#4F8EF7";
        e.currentTarget.style.transform = "scale(1)";
      }}
      title="Rewrite prompt with EPP"
    >
      +
    </button>
  );
  root.render(<Btn />);
  console.log("EPP: Floating plus button mounted");
}
