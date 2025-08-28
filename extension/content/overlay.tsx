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
  // Position above the input with some margin
  const margin = 16;
  host.style.top = `${Math.max(8, r.top + window.scrollY - 200)}px`;
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
        background: "#303030",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "28px",
        padding: "10px 10px",
        boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.1), inset 0px 0px 1px 0px rgba(255,255,255,0.2)",
        pointerEvents: "auto",
        fontFamily: "ui-sans-serif, -apple-system, system-ui, 'Segoe UI', Helvetica, 'Apple Color Emoji', Arial, sans-serif",
        fontSize: "16px",
        lineHeight: "24px",
        maxWidth: "640px",
        width: "100%",
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
          style={{ 
            fontSize: "16px", 
            lineHeight: "24px", 
            whiteSpace: "pre-wrap",
            color: "#fff",
            fontWeight: "400"
          }}
        >
          {text}
        </div>
        {tip && (
          <div style={{ 
            opacity: 0.69, 
            fontSize: "14px", 
            marginTop: 8,
            color: "#ffffff69",
            fontWeight: "400"
          }}>
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
                color: "#f3f3f3",
                border: "1px solid rgba(255,255,255,0.26)",
                borderRadius: "28px",
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "400",
                transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Dismiss (Esc)
            </button>
            <button
              onClick={onAccept}
              style={{
                background: "#fff",
                color: "#0d0d0d",
                border: "none",
                borderRadius: "28px",
                padding: "6px 12px",
                cursor: "pointer",
                fontWeight: "400",
                fontSize: "14px",
                transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.9)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff";
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
  };
  const onDismiss = () => {
    unmount();
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
