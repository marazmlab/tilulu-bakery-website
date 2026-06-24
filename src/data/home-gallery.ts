export type HomeGalleryItem = {
  src: string;
  altKey: `home.gallery.alt${1 | 2 | 3}`;
};

export const homeGallery: HomeGalleryItem[] = [
  {
    src: "/images/home/gallery-01.jpg",
    altKey: "home.gallery.alt1",
  },
  {
    src: "/images/home/gallery-02.jpg",
    altKey: "home.gallery.alt2",
  },
  {
    src: "/images/home/gallery-03.jpg",
    altKey: "home.gallery.alt3",
  },
];
