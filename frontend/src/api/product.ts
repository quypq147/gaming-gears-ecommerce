'use server';

import { axiosInstance } from '@/src/lib/axios';


export interface Product {
  id: number;
  documentId: string;
  name: string;
  price: number;
  slug: string;
  trending: boolean;
  sold: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  reviews: Review[];
}

export interface Review {
  id: number;
  rating: number;
  review: string;
  user: {
    id: number;
    username: string;
  };
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data } = await axiosInstance.get('/products');
    return data?.data.map((item: any) => ({
      id: item.id,
      documentId: item.documentId,
      name: item.name,
      price: item.price,
      brand : item.brand || [],
      slug: item.slug,
      trending: item.trending,
      sold: item.sold,
      quantity: item.quantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      publishedAt: item.publishedAt,
      reviews: item.reviews || [],
    })) || [];
  } catch (error: any) {
    console.error('Error fetching products:', error.message || error);
    throw new Error('Failed to fetch products');
  }
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
  try {
    const { data } = await axiosInstance.get(`/products`, {
      params: {
        'filters[slug][$eq]': slug,
        populate: 'reviews',
      },
    });

    if (!data?.data || data.data.length === 0) {
      throw new Error('Product not found');
    }

    const product = data.data[0];
    return {
      id: product.id,
      name: product.name,
      
      price: product.price,
      reviews: product.reviews || [],
    };
  } catch (error: any) {
    console.error('Error fetching product by slug:', error.message || error);
    throw new Error('Failed to fetch product');
  }
};