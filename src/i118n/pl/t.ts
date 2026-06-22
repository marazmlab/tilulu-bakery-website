import nav from "../pl/nav.json";
import footer from "../pl/footer.json";

const messages = {
  nav,
  footer,
} as const;

type Namespace = keyof typeof messages;

/**
 * Resolve UI label, e.g. t("nav.home") → "Strona główna"
 */

export function t(key: `${Namespace}.${string}`): string {
  const dotIndex = key.indexOf(".");
  const namespace = key.slice(0, dotIndex) as Namespace;
  const field = key.slice(dotIndex + 1);

  const dictionary = messages[namespace];
  if (!dictionary) {
    console.warn(`[i18n] Unknown namespace: ${namespace}`);
    return key;
  }

  const value = dictionary[field as keyof typeof dictionary];
  if (typeof value !== "string") {
    console.warn(`[i18n] Missing key: ${key}`);
  }

  return value;
}
