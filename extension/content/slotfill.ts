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

function rewritePrompt(
  text: string,
  intent: string,
  locale: LocaleKey
): string {
  const lowerText = text.toLowerCase();

  switch (intent) {
    case "ads":
      if (lowerText.includes("facebook") || lowerText.includes("post")) {
        return `Create an engaging Facebook post that ${text
          .replace(
            /^(compose|write|create|make)\s+(me\s+)?a\s+facebook\s+post\s+about\s+/i,
            ""
          )
          .replace(
            /^(about|for)\s+/i,
            ""
          )}. Include a compelling hook, relevant hashtags, and a clear call-to-action.`;
      }
      if (lowerText.includes("instagram") || lowerText.includes("story")) {
        return `Create an Instagram post that ${text
          .replace(
            /^(compose|write|create|make)\s+(me\s+)?an?\s+instagram\s+(post|story)\s+about\s+/i,
            ""
          )
          .replace(
            /^(about|for)\s+/i,
            ""
          )}. Include engaging visuals description, relevant hashtags, and a compelling caption.`;
      }
      return `Create a compelling social media post about ${text
        .replace(
          /^(compose|write|create|make)\s+(me\s+)?a\s+(post|ad)\s+about\s+/i,
          ""
        )
        .replace(
          /^(about|for)\s+/i,
          ""
        )}. Include a strong hook, engaging content, and a clear call-to-action.`;

    case "copy.product":
      const product = text
        .replace(
          /^(write|create|make|compose)\s+(me\s+)?a\s+(product\s+)?(description|copy)\s+(for|about)\s+/i,
          ""
        )
        .replace(/^(for|about)\s+/i, "");
      return `Write a comprehensive product description for ${product}. Include a compelling hook, key features with bullet points, detailed benefits, care instructions, and a strong call-to-action. Target discerning customers seeking quality and value.`;

    case "code.fix":
      return `Debug and fix this issue: ${text.replace(
        /^(fix|debug|help\s+with|solve)\s+/i,
        ""
      )}. Provide a clear explanation of the problem, the solution, and why it works. Include any necessary code changes.`;

    case "translate":
      return `Translate this text accurately while preserving the original tone and meaning: ${text.replace(
        /^(translate|convert)\s+/i,
        ""
      )}. Maintain cultural context and ensure natural flow in the target language.`;

    case "summarize":
      return `Create a concise summary of: ${text.replace(
        /^(summarize|summarise|brief|overview)\s+/i,
        ""
      )}. Highlight the key points, main arguments, and essential information in a clear, organized format.`;

    default:
      return text;
  }
}

export function buildLocalSuggestion(
  text: string,
  locale: LocaleKey,
  intent?: string
) {
  const pack = PACKS[locale] ?? en;
  const i = intent ?? routeIntent(text);
  const tip = pack.tips[i];

  // Create a rewritten version of the user's input
  const instruction = rewritePrompt(text, i, locale);

  return { instruction, tip };
}
