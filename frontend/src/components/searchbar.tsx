"use client";

import { useState, useEffect } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import placeholderImg from "@/src/assets/placeholder.png";
import Image from "next/image";
import { motion } from "framer-motion";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/products?filters[name][$containsi]=${encodeURIComponent(
            query
          )}`
        );
        if (!res.ok) throw new Error("Lỗi fetch data");

        const data = await res.json();
        setResults(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="relative w-full max-w-lg">
      <div className="flex items-center border border-gray-300 rounded-lg p-2 bg-white shadow-sm">
        <Search className="text-gray-400 mr-2" size={20} />
        <Input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border-none focus:ring-0"
        />
        <Button className="ml-2" disabled={loading}>
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </Button>
      </div>
      {results.length > 0 && (
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute w-full bg-white border border-gray-200 shadow-md mt-2 rounded-lg z-50"
        >
          {results.slice(0, 4).map((product) => (
            <motion.li
              key={product.id}
              whileHover={{ scale: 1.02 }}
              className="p-2 hover:bg-gray-100 flex items-center rounded-lg"
            >
              <Link href={`/product/${product.slug}`} className="flex items-center w-full">
                <Image
                  width={40}
                  height={40}
                  src={placeholderImg}
                  alt={product.name}
                  className="rounded-md"
                />
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.brand?.brand_name}</p>
                </div>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default SearchBar;
