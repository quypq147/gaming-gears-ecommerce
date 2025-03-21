"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface FilterOption {
  brand: string;
  category: string;
  price: number;
  search: string;
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
  const [price, setPrice] = useState<number>(1000); // Default max price
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    onFilter({ brand: selectBrand, category: selectCategory, price, search });
  }, [onFilter, selectBrand, selectCategory, price, search]);

  return (
    <div className="flex flex-wrap gap-4 items-center justify-center my-4">
      {/* Search Bar */}
      <Input
        type="text"
        placeholder="Search product..."
        className="w-60"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Brand Filter */}
      <Select onValueChange={(value) => setSelectBrand(value === "All" ? "" : value)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select Brand" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          {brands.map((brand, idx) => (
            <SelectItem key={idx} value={brand}>
              {brand.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Category Filter */}
      <Select onValueChange={(value) => setSelectCategory(value === "All" ? "" : value)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          {categories.map((cat, idx) => (
            <SelectItem key={idx} value={cat?.name}>
              {cat ? cat.toUpperCase() : "Unknown Category"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Price Slider */}
      <div className="flex flex-col items-center">
        <span className="text-sm font-medium">Max Price: ${price}</span>
        <Slider
          value={[price]}
          onValueChange={(val) => setPrice(val[0])}
          min={0}
          max={5000}
          step={50}
          className="w-40"
        />
      </div>
    </div>
  );
}

