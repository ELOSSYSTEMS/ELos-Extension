// Premium rewrite handler
chrome.runtime.onMessage.addListener((msg, _sender, respond) => {
  (async () => {
    if (msg.type !== "EPP_REWRITE") return;
    const { text, locale, intent } = msg.payload;
    const {
      provider = "openai",
      openaiKey = "",
      customEndpoint = "",
    } = await chrome.storage.sync.get({
      provider: "openai",
      openaiKey: "",
      customEndpoint: "",
    });

    try {
      if (provider === "custom" && customEndpoint) {
        const r = await fetch(customEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, locale, intent }),
        });
        const data = await r.json();
        respond({ instruction: data.instruction, tip: data.tip });
        return;
      }

      if (!openaiKey) throw new Error("NO_OPENAI_KEY");
      const sys = `You rewrite user prompts into a single natural-language instruction with concrete deliverables, in locale ${locale}. No JSON, no brackets.`;
      const user = `Locale: ${locale}\\nIntent: ${intent}\\nRaw: ${text}`;
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: sys },
            { role: "user", content: user },
          ],
          max_tokens: 320,
          temperature: 0.2,
        }),
      });
      const data = await r.json();
      const instruction = data.choices?.[0]?.message?.content?.trim() || text;
      respond({ instruction, tip: undefined });
    } catch (e: any) {
      respond({ error: String(e?.message || e) });
    }
  })();
  return true;
});
