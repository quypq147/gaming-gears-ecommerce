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
  categories: string[];
  onFilter?: (filter: FilterOption) => void;
}

export default function ProductFilter({
  brands,
  categories,
  onFilter = () => {},
}: ProductFilterProps) {
  const [selectBrand, setSelectBrand] = useState<string>("");
  const [selectCategory, setSelectCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(10000000);
  const [search, setSearch] = useState<string>("");
  console.log("Categories :", categories);

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
    <div className="flex flex-wrap gap-6 items-center justify-center my-6 bg-white p-4 rounded-lg shadow-md">
      {/* Search Bar */}
      <div className="flex flex-col items-start">
        <label htmlFor="search" className="text-sm font-medium text-gray-700">
          Tìm kiếm sản phẩm
        </label>
        <Input
          id="search"
          type="text"
          placeholder="Nhập tên sản phẩm..."
          className="w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Brand Filter */}
      <div className="flex flex-col items-start">
        <label htmlFor="brand" className="text-sm font-medium text-gray-700">
          Lọc theo thương hiệu
        </label>
        <Select
          onValueChange={(value) =>
            setSelectBrand(value === "All" ? "" : value)
          }
        >
          <SelectTrigger id="brand" className="w-48">
            <SelectValue placeholder="Chọn thương hiệu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Tất cả</SelectItem>
            {brands.map((brand, idx) => (
              <SelectItem key={idx} value={brand}>
                {brand.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Filter */}
      <div className="flex flex-col items-start">
        <label htmlFor="category" className="text-sm font-medium text-gray-700">
          Lọc theo loại sản phẩm
        </label>
        <Select
          onValueChange={(value) =>
            setSelectCategory(value === "All" ? "" : value)
          }
        >
          <SelectTrigger id="category" className="w-48">
            <SelectValue placeholder="Chọn loại sản phẩm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Tất cả</SelectItem>
            {categories.map((cat, index) => (
              <SelectItem key={index} value={cat}>
                {cat.toUpperCase()} 
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Slider */}
      <div className="flex flex-col items-start">
        <label htmlFor="price" className="text-sm font-medium text-gray-700">
          Giá tối đa
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">
            {formatCurrency(price)}
          </span>
        </div>
        <Slider
          id="price"
          value={[price]}
          onValueChange={(val) => setPrice(val[0])}
          min={0}
          max={100000000}
          step={50000}
          className="w-64"
        />
      </div>
    </div>
  );
}
