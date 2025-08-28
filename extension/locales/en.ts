export const en = {
  templates: {
    "copy.product": ({ entity }: { entity?: string }) =>
      `You are an expert e-commerce copywriter for premium home decor.
Write a complete product description for “${entity ?? "the product"}”.
Audience: discerning shoppers seeking quality and elegance.
Deliver: short hook (1–2 lines), key features (bulleted), detailed description (3–5 short paragraphs),
care/size notes, and a concise CTA.
Style: refined, concrete, zero fluff.`,

    ads: () =>
      `You are a performance marketer. Produce 5 ad variants with headlines, primary text, and CTA. Keep them testable and distinct.`,

    "code.fix": () =>
      `You are a senior engineer. Provide a minimal patch and a one-paragraph rationale.`,

    translate: () =>
      `You are a bilingual editor. Translate faithfully and preserve tone.`,

    summarize: () =>
      `You are a precise analyst. Produce a faithful summary with no loss of meaning.`,
  },
  tips: {
    "copy.product":
      "Tip: Add role, audience, sections, and tone for specificity.",
    ads: "Tip: Separate positioning angles across variants.",
    "code.fix": "Tip: Keep changes minimal; justify only when necessary.",
    translate: "Tip: Specify source/target and tone.",
    summarize: "Tip: Specify target length and audience.",
  },
};
