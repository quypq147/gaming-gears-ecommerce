"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Header from "@/src/components/header";
import ProductCard from "@/src/components/product-card";
import ProductFilter from "@/src/components/product-filter";
import { motion } from "framer-motion";

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

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="container">
      <Header />
      {products.length > 0 ? (
        <>
          <ProductFilter brands={brands} categories={categories} onFilter={handleFilter} />
          <motion.section
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <p>No products available.</p>
            )}
          </motion.section>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-10">Loading products...</p>
      )}
    </main>
  );
}

