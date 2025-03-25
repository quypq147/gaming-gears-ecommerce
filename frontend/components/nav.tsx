"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Menu, X, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import { useUserStore } from "@/app/store/userStore";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from "next/image";

function NavContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

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

        {session ? (
          <>
            {/* Dropdown Menu */}
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex items-center ">
                    {session?.user?.image ? (
                      <>
                      <Image
                        src={session.user.image}
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border border-gray-500 cursor-pointer"
                      />
                      <p className="text-white">Xin chào {session?.user?.name} !</p>
                      </>
                    ) : (
                      <>
                        <User className="w-6 h-6 text-white cursor-pointer hover:text-gray-300" />
                        <p className="text-white">Xin chào {session?.user?.name}</p>
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-black mt-2 w-40 shadow-lg rounded-md">
                  <DropdownMenuItem asChild>
                    <Link href={`/user/${session.user.id}`} className="block px-4 py-2 hover:bg-gray-200">
                      Trang Người Dùng
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()} className="block px-4 py-2 hover:bg-gray-200 cursor-pointer">
                    Đăng Xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </>
        ) : (
          // Nút Đăng Nhập
          <li>
            <Link href="/sign-in">
              <Button className="text-white cursor-pointer">Đăng Nhập</Button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default function Nav() {
  return (
    <SessionProvider>
      <NavContent />
    </SessionProvider>
  );
}










