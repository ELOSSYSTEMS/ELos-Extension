import { routeIntent } from "./router";
import { he } from "../locales/he";
import { en } from "../locales/en";
import { es } from "../locales/es";
import { pt } from "../locales/pt";

export type LocaleKey = "he" | "en" | "es" | "pt";
const PACKS: Record<LocaleKey, any> = { he, en, es, pt };

export const detectLocale = (s: string): LocaleKey => {
  if (/\p{Script=Hebrew}/u.test(s)) return "he";
  if (/[áéíóúñü¿¡]/i.test(s)) return "es";
  if (/[ãõçêâáéíóú]/i.test(s)) return "pt";
  return "en";
};

export const extractEntity = (s: string) => {
  const heNamed = s.match(/בשם\s+[\"“]?([^\"”]+)[\"”]?/);
  if (heNamed) return heNamed[1].trim();
  const byNamed = s.match(/(?:called|named)\s+[\"“]?([^\"”]+)[\"”]?/i);
  if (byNamed) return byNamed[1].trim();
  const quoted = s.match(/[\"“]([^\"”]+)[\"”]/);
  if (quoted) return quoted[1].trim();
  return null;
};

export function buildLocalSuggestion(
  text: string,
  locale: LocaleKey,
  intent?: string
) {
  const pack = PACKS[locale] ?? en;
  const i = intent ?? routeIntent(text);
  const tmpl = pack.templates[i];
  const tip = pack.tips[i];
  const entity = extractEntity(text);
  const instruction = tmpl ? tmpl({ entity }) : text;
  return { instruction, tip };
}
