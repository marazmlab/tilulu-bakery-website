/**
 * Site-wide constants — single source of truth for contact & social links.
 * Placeholders until owner confirms real values.
 */

export const site = {
  name: "Piekarnia Tilulu",
  tagline: "Piekarnia Domowa · Szczecin",
  location: "Szczecin",

  contact: {
    email: "kontakt@tilulu.pl",
    /** Display format shown to users */
    emailDisplay: "kontakt@tilulu.pl",
    // E.164-ish for tel: link - update when owner confirm
    phone: "+48000000000",
    phoneDisplay: "+48 --- --- ---",
  },

  social: {
    instagram: "https://www.instagram.com/tilulu.bakery/",
    facebook: "https://www.facebook.com/p/Tilulu-Bakery-61582916824207/",
  },

  legalName: "Tilulu Bakery",
} as const;

export type SiteConfig = typeof site;
