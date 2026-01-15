// modules/taxInformation/taxInformation.endpoints.ts
import type { ITaxItem } from "./taxInformation.types";

export const getTaxInformation = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const data: ITaxItem[] = [
    {
      id: "1",
      productName: "Smartphone X Pro",
      category: "Electronics",
      taxRate: "18%",
      releaseDate: "May 15, 2025",
      country: "China",
    },
    {
      id: "2",
      productName: "Organic Coffee Beans",
      category: "Food & Beverages",
      taxRate: "5%",
      releaseDate: "Apr 30, 2025",
      country: "Italy",
    },
  ];

  return { data };
};
