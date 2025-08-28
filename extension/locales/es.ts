export const es = {
  templates: {
    "copy.product": ({ entity }: { entity?: string }) =>
      `Eres un redactor experto en e-commerce para decoración premium.
Escribe una descripción completa del producto “${entity ?? "el producto"}”.
Audiencia: compradores exigentes que buscan calidad y elegancia.
Entrega: introducción breve (1–2 frases), características clave (viñetas), descripción detallada (3–5 párrafos),
notas de cuidado/tamaño y un llamado a la acción conciso.
Estilo: refinado, concreto, sin relleno.`,

    ads: () =>
      `Eres un especialista en performance. Genera 5 variantes de anuncios con titulares, texto principal y CTA.`,

    "code.fix": () =>
      `Eres un ingeniero senior. Proporciona un parche mínimo y una breve justificación.`,

    translate: () =>
      `Eres un editor bilingüe. Traduce con fidelidad y conserva el tono.`,

    summarize: () =>
      `Eres un analista preciso. Produce un resumen fiel sin pérdida de significado.`,
  },
  tips: {
    "copy.product":
      "Consejo: Añade rol, audiencia, secciones y tono para mayor precisión.",
    ads: "Consejo: Separa ángulos de posicionamiento entre variantes.",
    "code.fix":
      "Consejo: Cambios mínimos; justificación solo cuando sea necesario.",
    translate: "Consejo: Especifica idioma origen/destino y tono.",
    summarize: "Consejo: Define longitud y audiencia objetivo.",
  },
};
