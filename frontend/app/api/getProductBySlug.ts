"use server";

interface TextChild {
  type: string;
  text: string;
  bold?: boolean;
}

interface DescriptionBlock {
  type: "heading" | "paragraph";
  children: TextChild[];
  level?: number;
}

export interface ProductData {
  id: string;
  attributes: {
    name: string;
    category: { name: string };
    slug: string;
    price: number;
    brand: { brand_name: string };
    image: { url: string }[];
    vga_spec: {
      id: string;
      vram: string;
      memory_type: string;
      core_clock: number;
      boost_clock: number;
      power_draw: number;
    };
    mouse_spec?: {
      models: string;
      led: string;
      material: string;
      anti_slip: boolean;
    };
    mouse_pad_spec?: {
      models: string;
      led: string;
      material: string;
      anti_slip: boolean;
    };
    keyboard_spec?: {
      models: string;
      switch: string;
      battery_life: string;
      led: string;
      connectivity: string;
    };
    cpu_spec?: {
      cores: number;
      threads: number;
      base_clock: number;
      boost_clock: number;
      cache: number;
      socket:string;
    };
    headphone_spec?: {
      driver: string;
      frequency: string;
      impedance: string;
      sensitivity: string;
    };
    description: DescriptionBlock[];
  };
}

interface ProductsResponse {
  data: ProductData[];
}

export default async function getProductBySlug(slug: string) {
  if (!process.env.NEXT_PUBLIC_STRAPI_BASE_URL) {
    throw new Error("STRAPI_BASE_URL is not defined");
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/products?filters[slug][$eq]=${slug}&populate=*`
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Strapi error:", errorData.error);
      return null;
    }

    const json: ProductsResponse = await res.json();
    return json.data.length > 0 ? json.data[0] : null;
  } catch (error) {
    console.error("Failed to fetch product by slug:", error);
    return null;
  }
}
