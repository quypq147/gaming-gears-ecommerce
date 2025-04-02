'use client'

import Nav from "./nav";
import Logo from "./logo";
import SearchBar from "./searchbar";
import { Menu, X } from "lucide-react";
import React from "react";

function Header() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="flex flex-col md:flex-row justify-between items-center p-5 bg-black z-50">
      <div className="flex justify-between items-center w-full md:w-auto">
        <Logo />
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      <SearchBar />
      <div className="flex flex-col md:flex-row items-center w-full md:w-auto mt-4 md:mt-0">
        <Nav />
      </div>
    </header>
  );
}

export default Header;
