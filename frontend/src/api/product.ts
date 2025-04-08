"use server";

import { axiosInstance } from "@/src/lib/axios";


interface CpuBlock{

}
interface VgaBlock{}

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
  category: any[];
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
  key_board_spec?: { [key: string]: string }; // Thông số kỹ thuật bàn phím
  cpu_spec?: { [key: string]: string }; // Thông số kỹ thuật CPU
  headphone_spec?: { [key: string]: string }; // Thông số kỹ thuật tai nghe
  mouse_pad_spec?: { [key: string]: string }; // Thông số kỹ thuật lót chuột
  mouse_spec?: { [key: string]: string }; // Thông số kỹ thuật chuột
  vga_spec?: { [key: string]: string }; // Thông số kỹ thuật VGA
  monitor_spec?: { [key: string]: string }; // Thông số kỹ thuật màn hình
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
        category: item.category.name || [],
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
        populate: "*",
      },
    });

    if (!data?.data || data.data.length === 0) {
      throw new Error("Product not found");
    }

    const product = data.data[0];
    console.log("Product Detail Data" , product);
    return {
      id: product.id,
      name: product.name,
      category: product.category || [],
      price: product.price,
      image: product.image || [],
      brand: product.brand || [],
      description: product.description || [], 
      reviews: product.reviews || [],
      key_board_spec: product.key_board_spec || {},
      cpu_spec: product.cpu_spec || {},
      headphone_spec: product.headphone_spec || {},
      mouse_pad_spec: product.mouse_pad_spec || {},
      mouse_spec: product.mouse_spec || {},
      vga_spec: product.vga_spec || {},
      monitor_spec: product.monitor_spec || {},
    };
  } catch (error: any) {
    console.error("Error fetching product by slug:", error.message || error);
    throw new Error("Failed to fetch product");
  }
};
