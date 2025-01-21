interface Item {
  name: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchasePrice?: number;
  detailedDescription?: string;
  category: string;
}

export type { Item };
