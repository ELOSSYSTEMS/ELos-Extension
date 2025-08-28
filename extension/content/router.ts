export type Intent =
  | "copy.product"
  | "ads"
  | "code.fix"
  | "translate"
  | "summarize"
  | "writing";

export function routeIntent(s: string): Intent {
  const text = s.toLowerCase();

  // Code-related intents
  if (
    /(error|stack trace|react|typescript|javascript|bug|fix|code|function|variable|import|export|console\.log|debug|exception)/i.test(
      text
    )
  )
    return "code.fix";

  // Translation intents
  if (/(translate|תרגם|ترجم|traducir|traduzir|перевести)/i.test(text))
    return "translate";

  // Summary intents
  if (
    /(summary|summarize|tl;dr|brief|overview|recap|main points|key points)/i.test(
      text
    )
  )
    return "summarize";

  // Writing intents (essays, articles, content)
  if (
    /(write|compose|create|draft|essay|article|blog|content|story|narrative|report|paper|document)/i.test(
      text
    )
  )
    return "writing";

  // Ad/marketing intents
  if (
    /(ad|advertisement|headline|meta|google|cta|call to action|marketing|campaign|promote|sell|buy now|facebook post|instagram|social media)/i.test(
      text
    )
  )
    return "ads";

  // Product/e-commerce intents (more specific)
  if (
    /(product (page|description|review)|sku|shopify|candle|bouquet|e-commerce|store|shop|buy|purchase|price|inventory)/i.test(
      text
    )
  )
    return "copy.product";

  // Default to writing for general requests
  return "writing";
}
