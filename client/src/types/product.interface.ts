import type { Category } from './category.interface';
import type { Review } from './review.interface';
import {User} from "@/types/user.interface";

export enum ProductSort {
  HighPrice = 'HIGHT_PRICE',
  LowPrice = 'LOW_PRICE',
  Newest = 'NEWEST',
  Oldest = 'OLDEST',
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  quantity: number;
  categories: Category[];
}

export interface Filter {
  sort?: ProductSort;
  term?: string;
  page?: string | number;
  perPage?: string | number;
}

export interface UpdateProductData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  weight: number;
  images: string[];
  categoryId: number;
}

export interface ProductFullest extends Product {
  user?: User;
  reviews: Review[];
}

export interface GetAllProductsResponse {
  length: number,
  products: ProductFullest[],
}