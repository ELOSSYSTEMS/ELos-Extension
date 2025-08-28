export type Intent =
  | "copy.product"
  | "ads"
  | "code.fix"
  | "translate"
  | "summarize";

export function routeIntent(s: string): Intent {
  if (/(product (page|description)|sku|shopify|candle|bouquet)/i.test(s))
    return "copy.product";
  if (/(ad|headline|meta|google|cta)/i.test(s)) return "ads";
  if (/(error|stack trace|react|typescript|bug|fix)/i.test(s))
    return "code.fix";
  if (/(translate|תרגם|ترجم)/i.test(s)) return "translate";
  if (/(summary|summarize|tl;dr)/i.test(s)) return "summarize";
  return "copy.product";
}
