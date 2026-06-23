/**
 * Site-wide constants — single source of truth for contact & social links.
 * Placeholders until owner confirms real values.
 */

export const site = {
  name: "Piekarnia Tilulu",
  tagline: "Piekarnia Domowa · Szczecin",
  location: "Szczecin",

  contact: {
    email: "tilulu@gmail.pl",
    emailDisplay: "tilulu@gmail.pl",
    phone: "+48514736333",
    phoneDisplay: "+48 514 736 333",
  },

  social: {
    instagram: "https://www.instagram.com/tilulu.bakery/",
    facebook: "https://www.facebook.com/p/Tilulu-Bakery-61582916824207/",
  },

  legalName: "Tilulu Bakery",
} as const;

export type SiteConfig = typeof site;
