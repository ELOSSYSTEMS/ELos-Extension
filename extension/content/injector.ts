export function getInputEl(): HTMLTextAreaElement | null {
  const h = location.hostname;
  if (h.includes("chatgpt.com") || h.includes("openai.com")) {
    return document.querySelector("textarea");
  }
  if (h.includes("claude.ai")) return document.querySelector("textarea");
  if (h.includes("gemini.google.com"))
    return document.querySelector("textarea");
  return document.querySelector("textarea");
}

export function injectValue(txt: string) {
  const el = getInputEl();
  if (!el) return;
  el.value = txt;
  el.dispatchEvent(new Event("input", { bubbles: true }));
}
