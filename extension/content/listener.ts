import { getInputEl } from "./injector";
import { renderSuggestion } from "./overlay";
import { routeIntent } from "./router";
import { buildLocalSuggestion, detectLocale } from "./slotfill";

// Premium API call via background worker
async function premiumRewrite(
  text: string,
  locale: string,
  intent: string
): Promise<{ instruction: string; tip?: string }> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "EPP_REWRITE",
        payload: {
          text,
          locale,
          intent,
          features: { translate: true, tips: true },
        },
      },
      (resp) => {
        if (!resp || resp.error)
          return reject(resp?.error || "EPP_REWRITE_FAILED");
        resolve(resp);
      }
    );
  });
}

let idleTimer: number | undefined;
let lastValue = "";

export function attachIdleListener() {
  const input = getInputEl();
  if (!input) return;

  const onChange = () => {
    const val = (input as HTMLTextAreaElement).value;
    lastValue = val;

    if (idleTimer) window.clearTimeout(idleTimer);

    idleTimer = window.setTimeout(async () => {
      const text = lastValue.trim();
      // Only trigger for meaningful text (at least 10 characters and not just whitespace)
      if (!text || text.length < 10 || text.length > 1000) return;
      
      // Don't trigger for very short or very long text
      const words = text.split(/\s+/).length;
      if (words < 3) return;

      const locale = detectLocale(text);
      const intent = routeIntent(text);
      const { premiumEnabled = false } = await chrome.storage.sync.get({
        premiumEnabled: false,
      });

      try {
        let instruction = "";
        let tip: string | undefined;

        if (premiumEnabled) {
          const out = await premiumRewrite(text, locale, intent);
          instruction = out.instruction;
          tip = out.tip;
        } else {
          const local = buildLocalSuggestion(text, locale, intent);
          instruction = local.instruction;
          tip = local.tip;
        }

        // Only show if the instruction is significantly different from original
        if (instruction && instruction !== text && instruction.length > text.length * 1.2) {
          renderSuggestion({ instruction, tip, locale });
        }
      } catch {
        const local = buildLocalSuggestion(text, locale, intent);
        if (local.instruction && local.instruction !== text && local.instruction.length > text.length * 1.2) {
          renderSuggestion({
            instruction: local.instruction,
            tip: local.tip,
            locale,
          });
        }
      }
    }, 3000); // Increased to 3s idle
  };

  input.addEventListener("input", onChange);
}
