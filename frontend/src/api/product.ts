"use server";

import { axiosInstance } from "@/src/lib/axios";


interface CpuBlock{

}
interface DescriptionBlock {
  type: string; // Loại của block, ví dụ: "heading", "paragraph"
  children: Array<{
    type: string; // Loại của child, ví dụ: "text", "link"
    text?: string; // Nội dung văn bản (nếu có)
    url?: string; // URL (nếu là link)
    bold?: boolean; // Định dạng in đậm (nếu có)
  }>;
  level?: number; // Cấp độ của heading (nếu là heading), ví dụ: 1, 2, 3
}
export interface Product {
  id: number;
  documentId: string;
  name: string;
  price: number;
  brand: any[];
  slug: string;
  trending: boolean;
  sold: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  image: any[];
  publishedAt: string;
  description: DescriptionBlock[];
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
    const { data } = await axiosInstance.get("/products", {
      params: {
        populate: "*",
      },
    });
    return (
      data?.data.map((item: any) => ({
        id: item.id,
        documentId: item.documentId,
        name: item.name,
        price: item.price,
        brand: item.brand || [],
        slug: item.slug,
        trending: item.trending,
        sold: item.sold,
        discountPercent: item.discountPercent || 0,
        image: item.image || [],
        quantity: item.quantity,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        publishedAt: item.publishedAt,
        reviews: item.reviews || [],
      })) || []
    );
  } catch (error: any) {
    console.error("Error fetching products:", error.message || error);
    throw new Error("Failed to fetch products");
  }
};

export const getProductBySlug = async (slug: string): Promise<Product> => {
  try {
    const { data } = await axiosInstance.get(`/products`, {
      params: {
        "filters[slug][$eq]": slug,
        populate: "reviews",
      },
    });

    if (!data?.data || data.data.length === 0) {
      throw new Error("Product not found");
    }

    const product = data.data[0];
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      brand: product.brand || [],
      description: product.description || [], 
      reviews: product.reviews || [],
    };
  } catch (error: any) {
    console.error("Error fetching product by slug:", error.message || error);
    throw new Error("Failed to fetch product");
  }
};
