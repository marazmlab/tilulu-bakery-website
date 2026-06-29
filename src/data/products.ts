export type ProductCategoryId = "occasion" | "standard" | "custom";
export type FulfillmentBadge = "shipping" | "pickup";
export type PriceKind = "from" | "fixed";

export type ProductId =
  | "tortClassic"
  | "tortTall"
  | "tortKids"
  | "cookies"
  | "alfajores"
  | "cheesecake"
  | "brownie"
  | "glutenFree"
  | "vegan";

export type Product = {
  id: ProductId;
  categoryId: ProductCategoryId;
  nameKey: `offer.products.${ProductId}.name`;
  descriptionKey: `offer.products.${ProductId}.description`;
  priceKey: `offer.products.${ProductId}.price`;
  image: string;
  badges: FulfillmentBadge[];
  priceKind: PriceKind;
};

export type ProductCategory = {
  id: ProductCategoryId;
  titleKey: `offer.categories.${ProductCategoryId}.title`;
  descriptionKey: `offer.categories.${ProductCategoryId}.description`;
};

export const productCategories: ProductCategory[] = [
  {
    id: "occasion",
    titleKey: "offer.categories.occasion.title",
    descriptionKey: "offer.categories.occasion.description",
  },
  {
    id: "standard",
    titleKey: "offer.categories.standard.title",
    descriptionKey: "offer.categories.standard.description",
  },
  {
    id: "custom",
    titleKey: "offer.categories.custom.title",
    descriptionKey: "offer.categories.custom.description",
  },
];

export const products: Product[] = [
  {
    id: "tortClassic",
    categoryId: "occasion",
    nameKey: "offer.products.tortClassic.name",
    descriptionKey: "offer.products.tortClassic.description",
    priceKey: "offer.products.tortClassic.price",
    image: "/images/offer/tort-classic.jpg",
    badges: ["pickup"],
    priceKind: "from",
  },
  {
    id: "tortTall",
    categoryId: "occasion",
    nameKey: "offer.products.tortTall.name",
    descriptionKey: "offer.products.tortTall.description",
    priceKey: "offer.products.tortTall.price",
    image: "/images/offer/tort-tall.jpg",
    badges: ["pickup"],
    priceKind: "from",
  },
  {
    id: "tortKids",
    categoryId: "occasion",
    nameKey: "offer.products.tortKids.name",
    descriptionKey: "offer.products.tortKids.description",
    priceKey: "offer.products.tortKids.price",
    image: "/images/offer/tort-kids.jpg",
    badges: ["pickup"],
    priceKind: "from",
  },
  {
    id: "cookies",
    categoryId: "standard",
    nameKey: "offer.products.cookies.name",
    descriptionKey: "offer.products.cookies.description",
    priceKey: "offer.products.cookies.price",
    image: "/images/offer/cookies.jpg",
    badges: ["shipping"],
    priceKind: "fixed",
  },
  {
    id: "alfajores",
    categoryId: "standard",
    nameKey: "offer.products.alfajores.name",
    descriptionKey: "offer.products.alfajores.description",
    priceKey: "offer.products.alfajores.price",
    image: "/images/offer/alfajores.jpg",
    badges: ["shipping"],
    priceKind: "fixed",
  },
  {
    id: "cheesecake",
    categoryId: "standard",
    nameKey: "offer.products.cheesecake.name",
    descriptionKey: "offer.products.cheesecake.description",
    priceKey: "offer.products.cheesecake.price",
    image: "/images/offer/cheesecake.jpg",
    badges: ["pickup"],
    priceKind: "fixed",
  },
  {
    id: "brownie",
    categoryId: "standard",
    nameKey: "offer.products.brownie.name",
    descriptionKey: "offer.products.brownie.description",
    priceKey: "offer.products.brownie.price",
    image: "/images/offer/brownie.jpg",
    badges: ["pickup"],
    priceKind: "fixed",
  },
  {
    id: "glutenFree",
    categoryId: "custom",
    nameKey: "offer.products.glutenFree.name",
    descriptionKey: "offer.products.glutenFree.description",
    priceKey: "offer.products.glutenFree.price",
    image: "/images/offer/glutenFree.jpg",
    badges: ["pickup"],
    priceKind: "from",
  },
  {
    id: "vegan",
    categoryId: "custom",
    nameKey: "offer.products.vegan.name",
    descriptionKey: "offer.products.vegan.description",
    priceKey: "offer.products.vegan.price",
    image: "/images/offer/vegan.jpg",
    badges: ["pickup"],
    priceKind: "from",
  },
];

export function getProductsByCategory(categoryId: ProductCategoryId): Product[] {
  return products.filter((product) => product.categoryId === categoryId);
}
