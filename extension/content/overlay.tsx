import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { getInputEl, injectValue } from "./injector";

let root: ReturnType<typeof createRoot> | null = null;
let host: HTMLDivElement | null = null;

function ensureHost() {
  if (host) return host;
  host = document.createElement("div");
  host.id = "epp-overlay-host";
  host.style.position = "fixed";
  host.style.left = "50%";
  host.style.transform = "translateX(-50%)";
  host.style.zIndex = "2147483647";
  host.style.maxWidth = "780px";
  host.style.width = "calc(100% - 24px)";
  host.style.pointerEvents = "none";
  document.body.appendChild(host);
  return host;
}

function positionHost() {
  const input = getInputEl();
  if (!input || !host) return;
  const r = input.getBoundingClientRect();
  host.style.top = `${Math.max(8, r.top + window.scrollY - 110)}px`;
}

function Card({
  text,
  tip,
  locale,
  onAccept,
  onDismiss,
}: {
  text: string;
  tip?: string;
  locale: string;
  onAccept: () => void;
  onDismiss: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div
      ref={ref}
      tabIndex={-1}
      dir={locale === "he" ? "rtl" : "ltr"}
      style={{
        background: "#111",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "12px",
        padding: "12px 14px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        pointerEvents: "auto",
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onDismiss();
        if (e.key === "Tab") {
          e.preventDefault();
          onAccept();
        }
      }}
    >
      <div
        style={{ fontSize: "13px", lineHeight: 1.5, whiteSpace: "pre-wrap" }}
      >
        {text}
      </div>
      {tip && (
        <div style={{ opacity: 0.8, fontSize: "12px", marginTop: 6 }}>
          {tip}
        </div>
      )}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 10,
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={onDismiss}
          style={{
            background: "transparent",
            color: "#ccc",
            border: "1px solid #444",
            borderRadius: 8,
            padding: "6px 10px",
            cursor: "pointer",
          }}
        >
          Dismiss (Esc)
        </button>
        <button
          onClick={onAccept}
          style={{
            background: "#4F8EF7",
            color: "#000",
            border: "none",
            borderRadius: 8,
            padding: "6px 12px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Accept (Tab)
        </button>
      </div>
    </div>
  );
}

export function renderSuggestion({
  instruction,
  tip,
  locale,
}: {
  instruction: string;
  tip?: string;
  locale: string;
}) {
  ensureHost();
  positionHost();
  if (!root) root = createRoot(host!);

  const onAccept = () => {
    injectValue(instruction);
    unmount();
    // Reset the suggestion flag
    (globalThis as any).isShowingSuggestion = false;
  };
  const onDismiss = () => {
    unmount();
    // Reset the suggestion flag
    (globalThis as any).isShowingSuggestion = false;
  };

  function unmount() {
    if (!host) return;
    root!.render(<></>);
  }

  root.render(
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%" }}>
          <Card
            text={instruction}
            tip={tip}
            locale={locale}
            onAccept={onAccept}
            onDismiss={onDismiss}
          />
        </div>
      </div>
    </div>
  );

  window.addEventListener("scroll", positionHost, { passive: true });
  window.addEventListener("resize", positionHost);
}
