"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { ShoppingCart, Heart, Menu, X } from "lucide-react";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center p-4 bg-black text-white z-99">
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
              Shop
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

        <li>
          <Link href="/login">
            <Button className="text-white cursor-pointer">Login</Button>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;


