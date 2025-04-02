"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Input } from "@/src/components/ui/input";
import { Slider } from "@/src/components/ui/slider";

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
  const [price, setPrice] = useState<number>(10000000); // Mặc định 10 triệu VNĐ
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    onFilter({ brand: selectBrand, category: selectCategory, price, search });
  }, [onFilter, selectBrand, selectCategory, price, search]);

  // Hàm định dạng tiền Việt Nam
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

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
      <Select
        onValueChange={(value) => setSelectBrand(value === "All" ? "" : value)}
      >
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
      <Select
        onValueChange={(value) =>
          setSelectCategory(value === "All" ? "" : value)
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Price Slider */}
      <div className="flex flex-col items-center">
        <span className="text-sm font-medium">
          Giá tối đa: {price.toLocaleString("vi-VN")}₫
        </span>
        <Slider
          value={[price]}
          onValueChange={(val) => setPrice(val[0])}
          min={0}
          max={100000000}
          step={50000}
          className="w-40"
        />
      </div>
    </div>
  );
}
