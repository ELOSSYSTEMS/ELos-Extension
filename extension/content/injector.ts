export function getInputEl(): HTMLTextAreaElement | HTMLDivElement | null {
  const h = location.hostname;
  if (h.includes("chatgpt.com") || h.includes("openai.com")) {
    // ChatGPT uses contenteditable div, not textarea
    return (
      document.querySelector("#prompt-textarea") ||
      document.querySelector("[contenteditable='true']") ||
      document.querySelector("textarea")
    );
  }
  if (h.includes("claude.ai")) return document.querySelector("textarea");
  if (h.includes("gemini.google.com"))
    return document.querySelector("textarea");
  return document.querySelector("textarea");
}

export function getComposerContainer(): HTMLElement | null {
  const h = location.hostname;
  if (h.includes("chatgpt.com") || h.includes("openai.com")) {
    // Find the main composer container with the rounded background
    return (
      document.querySelector(".group\\/composer") ||
      document.querySelector("[data-type='unified-composer']") ||
      document.querySelector(".bg-token-bg-primary")
    );
  }
  return null;
}

export function injectValue(txt: string) {
  const el = getInputEl();
  if (!el) return;

  if (el instanceof HTMLTextAreaElement) {
    // Handle textarea elements
    el.value = txt;
    el.dispatchEvent(new Event("input", { bubbles: true }));
  } else if (el instanceof HTMLDivElement && el.contentEditable === "true") {
    // Handle contenteditable elements (like ChatGPT)
    el.innerHTML = `<p>${txt.replace(/\n/g, "<br>")}</p>`;
    el.dispatchEvent(new Event("input", { bubbles: true }));

    // Also trigger other events that might be needed
    el.dispatchEvent(new Event("change", { bubbles: true }));
    el.dispatchEvent(new Event("blur", { bubbles: true }));
    el.dispatchEvent(new Event("focus", { bubbles: true }));
  }
}
