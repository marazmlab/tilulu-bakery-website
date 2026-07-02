import nav from "@/i18n/pl/nav.json";
import footer from "@/i18n/pl/footer.json";
import home from "@/i18n/pl/home.json";
import offer from "@/i18n/pl/offer.json";
import about from "@/i18n/pl/about.json";
import contact from "@/i18n/pl/contact.json";

const messages = {
  nav,
  footer,
  home,
  offer,
  about,
  contact,
} as const;

type Namespace = keyof typeof messages;

export function t(key: `${Namespace}.${string}`): string {
  const dotIndex = key.indexOf(".");
  const namespace = key.slice(0, dotIndex) as Namespace;
  const field = key.slice(dotIndex + 1);

  const dictionary = messages[namespace];
  if (!dictionary) {
    return key;
  }

  const value = dictionary[field as keyof typeof dictionary];
  if (typeof value !== "string") {
    return key;
  }

  return value;
}
