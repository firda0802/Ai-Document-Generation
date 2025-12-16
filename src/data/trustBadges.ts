export interface TrustBadge {
  id: number;
  name: string;
  logo: string;
  type: "company" | "certification" | "award";
}

export const trustBadges: TrustBadge[] = [
  {
    id: 1,
    name: "Forbes",
    logo: "https://cdn.brandfolder.io/HT83KHL6/at/kkqx8spxnpg9j4frxq4q3p/Forbes_logo.svg",
    type: "company"
  },
  {
    id: 2,
    name: "TechCrunch",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b9/TechCrunch_logo.svg",
    type: "company"
  },
  {
    id: 3,
    name: "Product Hunt",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Product_Hunt_Logo.svg",
    type: "award"
  },
  {
    id: 4,
    name: "G2",
    logo: "https://images.g2crowd.com/uploads/attachment/file/1616/G2_logomark_500x500.png",
    type: "certification"
  },
  {
    id: 5,
    name: "Capterra",
    logo: "https://www.capterra.com/images/capterra-logo.svg",
    type: "certification"
  },
  {
    id: 6,
    name: "The Next Web",
    logo: "https://cdn4.iconfinder.com/data/icons/liu-square-blac/60/tnw-square-social-media-512.png",
    type: "company"
  }
];
