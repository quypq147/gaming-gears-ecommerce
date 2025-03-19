"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import placeholderImg from "@/assets/placeholder.png";
import Image from "next/image";

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
          `http://localhost:1337/api/products?filters[name][$containsi]=${encodeURIComponent(
            query
          )}`
        );
        if (!res.ok) throw new Error("Failed to fetch");

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
      <div className="hidden sm:flex items-center border border-gray-300 rounded-lg p-1">
        <Search className="text-gray-400 mr-2" size={20} />
        <Input
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border-none focus:ring-0 text-white"
        />
        <Button className="ml-2" disabled={loading}>
          {loading ? "Searching..." : "Go"}
        </Button>
      </div>
      {results.length > 0 && (
        <ul className="absolute w-full bg-white border border-gray-200 shadow-md mt-2 rounded-lg z-99">
          {results.slice(0, 4).map((product) => (
            <li key={product.id} className="p-2 hover:bg-gray-100 flex items-center rounded-lg">
              <Link href={`/product/${product.slug}`}>
                <span>
                  <Image width={24} height={24} src={product.image?.url || placeholderImg} alt={product.id} className=""/>
                </span>
                <span>
                  <p className="text-sm font-medium text-gray-900">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.brand?.brand_name}
                  </p>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
