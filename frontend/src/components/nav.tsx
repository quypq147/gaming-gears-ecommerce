"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ShoppingCart, Heart, Menu, X, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useUserStore } from "@/src/store/userStore";
import LogoutButton from "@/src/components/auth/LogoutButton";
import { useRouter } from "next/navigation"; // Sử dụng useRouter từ next/navigation

function NavContent() {
  const [isOpen, setIsOpen] = useState(false);

  // Lấy trạng thái người dùng từ Zustand
  const user = useUserStore((state) => state.user);
  const router = useRouter(); // Sử dụng useRouter

  return (
    <nav className="flex justify-between items-center p-4 bg-black text-white z-50">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Nav Links */}
      <ul
        className={`absolute md:static top-16 left-0 w-full md:w-auto bg-black md:bg-transparent flex flex-col md:flex-row gap-5 md:gap-8 items-center p-6 md:p-0 transition-all duration-300 ${
          isOpen ? "block" : "hidden md:flex"
        }`}
      >
        {/* Cửa hàng */}
        <li>
          <Link href="/shop">
            <b className="text-white cursor-pointer hover:text-gray-300">
              Cửa hàng
            </b>
          </Link>
        </li>

        {/* Wishlist Icon */}
        <li>
          <Link href="/wishlist">
            <Heart className="w-6 h-6 text-white cursor-pointer hover:text-red-400 transition" />
          </Link>
        </li>

        {/* Cart Icon */}
        <li>
          <Link href="/cart">
            <ShoppingCart className="w-6 h-6 text-white cursor-pointer hover:text-gray-400 transition" />
          </Link>
        </li>

        {/* Kiểm tra trạng thái người dùng */}
        {user ? (
          <>
            {/* Dropdown Menu cho người dùng đã đăng nhập */}
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 text-white cursor-pointer hover:text-gray-300 transition">
                    <User className="w-6 h-6" />
                    <span>{user.username}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 text-white shadow-lg rounded-md p-2">
                  <DropdownMenuItem
                    onClick={() => router.push(`/user/${user.id}`)}
                    className="hover:bg-gray-700 rounded-md px-4 py-2 transition"
                  >
                    Hồ sơ
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push(`/user/${user.id}/orderHistory`)}
                    className="hover:bg-gray-700 rounded-md px-4 py-2 transition"
                  >
                    Đơn hàng
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700 rounded-md px-4 py-2 transition">
                    <LogoutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </>
        ) : (
          // Nút Đăng Nhập
          <li>
            <Link href="/auth/sign-in">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white transition">
                Đăng Nhập
              </Button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default function Nav() {
  return <NavContent />;
}