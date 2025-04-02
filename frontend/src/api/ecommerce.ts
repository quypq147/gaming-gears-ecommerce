import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interfaces
export interface Product {
  id: string;
  name: string;
  price: number;
  slug: string;
  category: string;
  brand: string;
  image: string[];
  description: DescriptionBlock[];
  specs?: any;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
}

interface DescriptionBlock {
  type: "heading" | "paragraph";
  children: { type: string; text: string; bold?: boolean }[];
}

// API Functions

/**
 * Fetch all brands.
 * @returns {Promise<Brand[]>} List of brands.
 */
export const fetchBrands = async (): Promise<Brand[]> => {
  try {
    const response = await axiosInstance.get("/brands", {
      params: {
        populate: "*", // Include all related data
      },
    });

    return response.data.data.map((brand: any) => ({
      id: brand.id,
      name: brand.attributes.brand_name,
      logo: brand.attributes.brand_logo?.url || "",
    }));
  } catch (error: any) {
    console.error("Error fetching brands:", error.message || error);
    throw new Error("Failed to fetch brands");
  }
};

/**
 * Fetch all products with optional filters.
 * @param filters Optional filters for category or other attributes.
 * @returns {Promise<Product[]>} List of products.
 */
export const fetchProducts = async (filters?: { category?: string }): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get("/products", {
      params: {
        populate: "*",
        ...(filters?.category && {
          "filters[category][name][$eq]": filters.category,
        }),
      },
    });

    return response.data.data.map((product: any) => ({
      id: product.id,
      name: product.attributes.name,
      price: product.attributes.price,
      slug: product.attributes.slug,
      category: product.attributes.category?.name || "",
      brand: product.attributes.brand?.brand_name || "",
      image: product.attributes.image?.map((img: any) => img.url) || [],
      description: product.attributes.description || [],
      specs: {
        vga: product.attributes.vga_spec,
        mouse: product.attributes.mouse_spec,
        keyboard: product.attributes.keyboard_spec,
        cpu: product.attributes.cpu_spec,
        headphone: product.attributes.headphone_spec,
      },
    }));
  } catch (error: any) {
    console.error("Error fetching products:", error.message || error);
    throw new Error("Failed to fetch products");
  }
};

/**
 * Fetch a single product by its slug.
 * @param slug The slug of the product.
 * @returns {Promise<Product | null>} The product or null if not found.
 */
export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const response = await axiosInstance.get("/products", {
      params: {
        "filters[slug][$eq]": slug,
        populate: "*",
      },
    });

    if (!response.data.data || response.data.data.length === 0) {
      return null;
    }

    const product = response.data.data[0];
    return {
      id: product.id,
      name: product.attributes.name,
      price: product.attributes.price,
      slug: product.attributes.slug,
      category: product.attributes.category?.name || "",
      brand: product.attributes.brand?.brand_name || "",
      image: product.attributes.image?.map((img: any) => img.url) || [],
      description: product.attributes.description || [],
      specs: {
        vga: product.attributes.vga_spec,
        mouse: product.attributes.mouse_spec,
        keyboard: product.attributes.keyboard_spec,
        cpu: product.attributes.cpu_spec,
        headphone: product.attributes.headphone_spec,
      },
    };
  } catch (error: any) {
    console.error("Error fetching product by slug:", error.message || error);
    throw new Error("Failed to fetch product by slug");
  }
};