"use client";

import ProductCard from "./product-card";
import { motion } from "framer-motion";

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

export default function ProductList({ products }: ProductListProps) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products?.map((product: Product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
