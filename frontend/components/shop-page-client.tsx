"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Header from "@/components/header";
import ProductCard from "@/components/product-card";
import ProductFilter from "@/components/product-filter";

export default function ShopPageClient({ products = [] }) {
  const [allProducts] = useState(products);
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // Memoized brands and categories extraction (lowercased for consistency)
  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand?.brand_name?.toLowerCase()).filter(Boolean))],
    [products]
  );

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category?.name?.toLowerCase()).filter(Boolean))],
    [products]
  );

  // Optimized filtering function
  const handleFilter = useCallback(
    ({ brand, category }) => {
      setFilteredProducts(
        allProducts.filter(
          (product) =>
            (!brand || product.brand?.brand_name?.toLowerCase() === brand) &&
            (!category || product.category?.name?.toLowerCase() === category)
        )
      );
    },
    [allProducts]
  );

  return (
    <main className="container">
      <Header />
      {products.length > 0 ? (
        <>
          <ProductFilter brands={brands} categories={categories} onFilter={handleFilter} />
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p>No products available.</p>
            )}
          </section>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-10">Loading products...</p>
      )}
    </main>
  );
}

