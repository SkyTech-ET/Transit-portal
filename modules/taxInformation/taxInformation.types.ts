// modules/taxInformation/taxInformation.types.ts

export interface ITaxItem {
  id: string;
  productName: string;
  category: string;
  taxRate: string;
  releaseDate: string;
  country: string;
}

export interface ICategoryOption {
  label: string;
  value: string;
}
