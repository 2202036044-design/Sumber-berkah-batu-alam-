import { Product } from './types';
import { bestSellerProducts } from './categories/bestSeller';
import { wallcladdingProducts } from './categories/wallcladding';
import { batuDindingProducts } from './categories/batuDinding';
import { batuLantaiProducts } from './categories/batuLantai';
import { koralTamanProducts } from './categories/koralTaman';
import { marmerDllProducts } from './categories/marmerDll';

// Re-export the Product interface for convenience
export type { Product };

/**
 * Main product data array combined from individual category files.
 * This structure makes it easier to manage large datasets.
 */
export const productsData: Product[] = [
  ...bestSellerProducts,
  ...wallcladdingProducts,
  ...batuDindingProducts,
  ...batuLantaiProducts,
  ...koralTamanProducts,
  ...marmerDllProducts,
];

// If you need to find a specific product by ID
export const getProductById = (id: number): Product | undefined => {
  return productsData.find(p => p.id === id);
};
