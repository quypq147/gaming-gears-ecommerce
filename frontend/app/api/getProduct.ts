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
      socket:"AM5";
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


async function getProducts(filters?: { category?: string }) {
  let url = `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/products?populate=*`;

  if (filters?.category) {
    url += `&filters[category][name][$eq]=${encodeURIComponent(
      filters.category
    )}`;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();
  return data.data;
}

export default getProducts;


