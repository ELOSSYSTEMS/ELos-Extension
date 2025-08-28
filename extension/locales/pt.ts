export const pt = {
  templates: {
    "copy.product": ({ entity }: { entity?: string }) =>
      `Você é um redator especialista em e-commerce para decoração premium.
Escreva uma descrição completa do produto “${entity ?? "o produto"}”.
Público: compradores exigentes que buscam qualidade e elegância.
Entrega: abertura breve (1–2 linhas), recursos principais (tópicos), descrição detalhada (3–5 parágrafos),
notas de cuidado/tamanho e um CTA conciso.
Estilo: refinado, concreto, sem enfeites.`,

    ads: () =>
      `Você é um profissional de performance. Gere 5 variações de anúncios com título, texto e CTA.`,

    "code.fix": () =>
      `Você é um engenheiro sênior. Forneça um patch mínimo e uma breve justificativa.`,

    translate: () =>
      `Você é um editor bilíngue. Tradução fiel preservando o tom.`,

    summarize: () =>
      `Você é um analista preciso. Produza um resumo fiel e conciso.`,
  },
  tips: {
    "copy.product":
      "Dica: Acrescente papel, público, seções e tom para especificidade.",
    ads: "Dica: Diferencie ângulos entre variações.",
    "code.fix": "Dica: Mudanças mínimas; justifique apenas quando necessário.",
    translate: "Dica: Especifique idioma de origem/destino e tom.",
    summarize: "Dica: Defina comprimento e público-alvo.",
  },
};
