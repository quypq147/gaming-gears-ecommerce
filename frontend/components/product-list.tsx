"use client";

import ProductCard from "./product-card";

export interface Product {
  id: number;
  name: string;
  brand: {
    brand_name: string;
  };
  price: number;
  image: { url: string }[];
}

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {products?.map((product: any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
