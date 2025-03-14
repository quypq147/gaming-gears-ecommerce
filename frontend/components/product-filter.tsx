"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterOption {
  brand: string;
  category: string;
}

interface ProductFilterProps {
  brands: string[];
  categories: { id: string; name: string }[];
  onFilter?: (filter: FilterOption) => void;
}

export default function ProductFilter({
  brands,
  categories,
  onFilter = () => {},
}: ProductFilterProps) {
  const [selectBrand, setSelectBrand] = useState<string>("");
  const [selectCategory, setSelectCategory] = useState<string>("");

  // Update filter whenever selection changes
  useEffect(() => {
    onFilter({ brand: selectBrand, category: selectCategory });
  }, [onFilter, selectBrand, selectCategory]);

  // Handle "All" option to reset filter values
  const handleBrandChange = (value: string) => {
    setSelectBrand(value === "All" ? "" : value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectCategory(value === "All" ? "" : value);
  };

  return (
    <div className="flex flex-wrap gap-4 items-center justify-center my-4">
      {/* Brand Filter */}
      <Select onValueChange={handleBrandChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select Brand" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          {brands.map((brand, idx) => (
            <SelectItem key={idx} value={brand}>
              {brand.toLocaleUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Category Filter */}
      <Select onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All" className="font-bold">
            All
          </SelectItem>
          {categories.map((cat, idx) => (
            <SelectItem key={idx} value={cat || ""} className="font-bold">
              {cat ? cat.toUpperCase() : "Unknown Category"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
